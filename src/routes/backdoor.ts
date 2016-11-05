/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as settingsDal from "../data/settings_dal";
const twilio = require("twilio");
const _settingsDal = new settingsDal.SettingsDAL();
const rpi433 = require("rpi-433"),
rfSniffer = rpi433.sniffer({
  pin: 2,                     //Snif on GPIO 2 (or Physical PIN 13)
  debounceDelay: 500          //Wait 500ms before reading another code
});


class RFData {
    code: string;
    pulseLength: string;
}

//Setting DataAccessLayer Code
const _settings = _settingsDal.getSettingsByKey("twilio").then((twilio: any) => {
    console.log(twilio);
    console.log(twilio.data);
    //Twilio registration
    let twilioSettings = twilio;
    const client = twilio(twilioSettings.data.value.accountsid, twilioSettings.data.value.authtoken);

    // Receive (data is like {code: xxx, pulseLength: xxx})
    rfSniffer.on("data", function(data: RFData) {
        //console.log("---------------------------------");
        //console.log(data);
        //console.log("[BackDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
        _settingsDal.getSettingsByKey("backdoor").then((backdoorSettings: any) => {
            //console.log("BackDoor Settings");
            //console.log(backdoorSettings);
            if (+(data.code) === +(backdoorSettings.data.value.sensor.receivercode)) {
                // Send the text message.
                console.log("[Back Door]  Code Match Found. Now sending Text");
                console.log(twilioSettings.data.value.textto + "   ###   " + twilioSettings.data.value.textfrom);
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
