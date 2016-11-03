/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as events from "events";
import * as fs from "fs";
import * as path from "path";
import * as settingsDal from "../data/settings_dal";

const _settingsDal = new settingsDal.SettingsDAL();
const exec = require("child_process").exec;
const rpio = require("rpio");
const rpi433 = require("rpi-433"),
    rfSniffer = rpi433.sniffer({
        pin: 2,                     //Snif on GPIO 2 (or Physical PIN 13)
        debounceDelay: 500          //Wait 500ms before reading another code
    });
const twilio = require("twilio");
const config = require("config");
// PIN = config.get("api.garage.pin");


let PIN: any = null;
_settingsDal.getSettingsByKey("garage").then((garageSettings: any) => {
    //console.log("Garage PIN = " + garageSettings.data.value.pin);
    PIN = garageSettings.data.value.pin;
});

class RFData {
    code: string;
    pulseLength: string;
}

class Task {
    message: string;
    created: Date;
}


const _settings = _settingsDal.getSettingsByKey("twilio").then((twilioSettings: any) => {
    //console.log(twilioSettings);
    //console.log(twilioSettings.data);
    //Twilio registration
    const client = twilio(twilioSettings.data.value.accountsid, twilioSettings.data.value.authtoken);
    // Receive (data is like {code: xxx, pulseLength: xxx})
    rfSniffer.on("data", function(data: RFData) {
        //console.log("---------------------------------");
        //console.log(data);
        //console.log("[GarageDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
        _settingsDal.getSettingsByKey("garage").then((garageSettings: any) => {
            if (+(data.code) === +(garageSettings.data.value.sensor.receivercode)) {
                // Send the text message.
                console.log("Code Match Found. Now sending Text");
                client.sendMessage({
                    to: "" + twilioSettings.data.value.textto,
                    from: "" + twilioSettings.data.value.textfrom,
                    body: "" + garageSettings.data.value.sensor.message
                });
                console.log("Text Sent!");
                console.log("---------------------------------");
            }
        });
    });
});
//*******************************************************************
//GPIO Library used - https://github.com/jperkin/node-rpio
//*******************************************************************
module Route {
    export class Garage {
        on(req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log("Inside on/off with PIN = " + PIN);
            const tasks: Task[] = [];
            tasks.push({ message: "Initializing PIN for OUTPUT", created: new Date() });
            console.log("initializing PIN for OUTPUT");
            rpio.open(PIN, rpio.OUTPUT);
            tasks.push({ message: "Setting PIN for HIGH/1", created: new Date() });
            console.log("Setting PIN for HIGH/1");
            rpio.write(PIN, rpio.HIGH);
            tasks.push({ message: "Waiting 1 sec.", created: new Date() });
            console.log("Waiting 1 sec.");
            rpio.msleep(1000);
            tasks.push({ message: "Setting PIN for LOW/0", created: new Date() });
            console.log("Setting PIN for LOW/0");
            rpio.write(PIN, rpio.LOW);
            tasks.push({ message: "Finishing Garage Door Operations", created: new Date() });

            return res.json(tasks);
        }

        takepicture(req: express.Request, res: express.Response, next: express.NextFunction) {
            let child = exec("fswebcam -r 1280×720 garage.jpg", function(error: Error, stdout: Buffer, stderr: Buffer) {
                if (error) {
                    console.log(error);
                } else {
                    res.set({
                        "Content-Disposition": "attachment; filename=garage.jpg",
                        "content-type": "image/jpg"
                    });
                    return res.sendFile(path.resolve(__dirname + "/../../garage.jpg"));
                }
            });
        }
    }
}
export = Route;
