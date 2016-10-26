/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as events from "events";
import * as fs from "fs";
import * as path from "path";


const exec = require("child_process").exec;
const rpio = require("rpio");


const config = require("config");
const PIN = config.get("api.garage.pin");

/* Following code is for reading garage door sensor
 We have RF 433Mhz Door sensor for Garaga Door.
 We are using Libaray called- "rpi-433".
 Now, Once sensor sniff correct sensor code,
 We are using Twilio to send SMS/Text to cellphone.
 Every values are in config.
 */
class RFData {
  code: string;
  pulseLength : string;
}
const rpi433 = require("rpi-433"),
    rfSniffer = rpi433.sniffer({
        pin: 2,                     //Snif on GPIO 2 (or Physical PIN 13)
        debounceDelay: 500          //Wait 500ms before reading another code
    });

const twilio = require("twilio");
const client = twilio(config.get("api.twilio.accountsid"), config.get("api.twilio.authtoken"));

// Receive (data is like {code: xxx, pulseLength: xxx})
rfSniffer.on ("data", function ( data: RFData ) {
  console.log("---------------------------------");
  console.log(data);
  console.log("[GarageDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);

  if (+(data.code) === 5592405) {
    // Send the text message.
     console.log("Code Match Found. Now sending Text");
     client.sendMessage({
          to: "" + config.get("api.twilio.textto"),
          from: "" + config.get("api.twilio.textfrom"),
          body: "" + config.get("api.garage.sensor.message")
    });

    console.log("Text Sent!");
    console.log("---------------------------------");
  }

});


class Task {
    message: string;
    created: Date;
}

//*******************************************************************
//GPIO Library used - https://github.com/jperkin/node-rpio
//*******************************************************************
module Route {
    export class Garage {
        on(req: express.Request, res: express.Response, next: express.NextFunction) {
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
