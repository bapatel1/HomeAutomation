/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as settingsDal from "../data/settings_dal";
const _settingsDal = new settingsDal.SettingsDAL();
const twilio = require("twilio");
const config = require("config");
const PIN = config.get("api.kitchendoor.pin");

class RFData {
    code: string;
    pulseLength: string;
}

const rpi433 = require("rpi-433"),
    rfSniffer = rpi433.sniffer({
        pin: 2,                     //Snif on GPIO 2 (or Physical PIN 13)
        debounceDelay: 500          //Wait 500ms before reading another code
    });

const _settings = _settingsDal.getSettingsByKey("twilio").then((twilio: any) => {
    //console.log(twilioSettings);
    //console.log(twilioSettings.data);
    //Twilio registration
    let twilioSettings = twilio;
    const client = twilio(twilioSettings.data.value.accountsid, twilioSettings.data.value.authtoken);
    // Receive (data is like {code: xxx, pulseLength: xxx})
    rfSniffer.on("data", function(data: RFData) {
        //console.log("---------------------------------");
        //console.log(data);
        //console.log("[KitchenDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
        _settingsDal.getSettingsByKey("backdoor").then((kitchendoorSettings: any) => {
            //console.log("KitchenDoor Settings");
            //console.log(kitchendoorSettings);
            if (+(data.code) === +(kitchendoorSettings.data.value.sensor.receivercode)) {
                // Send the text message.
                console.log("[Kitchen Door]  Code Match Found. Now sending Text");
                console.log(twilioSettings.data.value.textto + "   ###   " + twilioSettings.data.value.textfrom);
                client.sendMessage({
                    to: "" + twilioSettings.data.value.textto,
                    from: "" + twilioSettings.data.value.textfrom,
                    body: "" + kitchendoorSettings.data.value.sensor.message
                });

                console.log("Text Sent!");
                console.log("---------------------------------");
            }
        });
    });
});

module Route {
    export class KitchenDoor {
        //Nothing goes here as this class basically have to just listen RF door sensors
    }
}
export = Route;
