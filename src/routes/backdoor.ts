/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
const twilio = require("twilio");

class RFData {
    code: string;
    pulseLength: string;
}

const rpi433 = require("rpi-433"),
    rfSniffer = rpi433.sniffer({
        pin: 2,                     //Snif on GPIO 2 (or Physical PIN 13)
        debounceDelay: 500          //Wait 500ms before reading another code
    });

//Setting DataAccessLayer Code
import * as settingsDal from "../data/settings_dal";
const _settingsDal = new settingsDal.SettingsDAL();
const _settings = _settingsDal.getSettingsByKey("twilio").then((twilioSettings: any) => {
    console.log(twilioSettings);
    console.log(twilioSettings.data);
    //Twilio registration
    const client = twilio(twilioSettings.data.value.accountsid, twilioSettings.data.value.authtoken);

    // Receive (data is like {code: xxx, pulseLength: xxx})
    rfSniffer.on("data", function(data: RFData) {
        console.log("---------------------------------");
        console.log(data);
        console.log("[BackDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
        _settingsDal.getSettingsByKey("backdoor").then((backdoorSettings: any) => {
            console.log("BackDoor Settings");
            console.log(backdoorSettings);
            if (+(data.code) === +(backdoorSettings.data.value.sensor.receivercode)) {
                // Send the text message.
                console.log("Code Match Found. Now sending Text");
                client.sendMessage({
                    to: "" + twilioSettings.data.value.textto,
                    from: "" + twilioSettings.data.value.textfrom,
                    body: "" + backdoorSettings.data.value.sensor.message
                });

                console.log("Text Sent!");
                console.log("---------------------------------");
            }
        });

    });
});
module Route {
    export class BackDoor {
        //Nothing goes here as this class basically have to just listen RF door sensors
    }
}
export = Route;
