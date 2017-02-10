/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
// import * as settingsDal from "../data/settings_dal";
// const _settingsDal = new settingsDal.SettingsDAL();
const twilio = require("twilio");
const config = require("config");

class RFData {
    code: string;
    pulseLength: string;
}

const rpi433 = require("rpi-433"),
    rfSniffer = rpi433.sniffer({
        pin: 2,                     //Snif on GPIO 2 (or Physical PIN 13)
        debounceDelay: 500          //Wait 500ms before reading another code
    });

const client = twilio(config.get("twilio.accountsid"), config.get("twilio.authtoken"));

// Receive (data is like {code: xxx, pulseLength: xxx})
rfSniffer.on("data", function (data: RFData) {
    //console.log("---------------------------------");
    //console.log(data);
    //console.log("[KitchenDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
    if (+(data.code) === +(config.get("kitchendoor.receivercode"))) {
        // Send the text message.
        console.log("[Kitchen Door]  Code Match Found. Now sending Text");
        console.log(config.get("twilio.textto") + "   ###   " + config.get("twilio.textfrom"));
        client.sendMessage({
            to: "" + config.get("twilio.textto"),
            from: "" + config.get("twilio.textfrom"),
            body: "kitchen door activity"
        });
        console.log("Text Sent!");
        console.log("---------------------------------");
    }

});
module Route {
    export class KitchenDoor {
        //Nothing goes here as this class basically have to just listen RF door sensors
    }
}
export = Route;
