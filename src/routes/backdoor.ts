/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as events from "events";
import * as fs from "fs";
import * as path from "path";

const config = require("config");
//Setting DataAccessLayer Code
import * as settingsDal from "../data/settings_dal";
const _settingsDal = new settingsDal.SettingsDAL();
const _settings = _settingsDal.getSettingsByKey("twilio").then((twilioSettings: any) => {
    console.log(twilioSettings);
    console.log(twilioSettings.data);
    /* Following code is for reading garage door sensor
     We have RF 433Mhz Door sensor for Garaga Door.
     We are using Libaray called- "rpi-433".
     Now, Once sensor sniff correct sensor code,
     We are using Twilio to send SMS/Text to cellphone.
     Every values are in config.
     */
    class RFData {
        code: string;
        pulseLength: string;
    }

    const rpi433 = require("rpi-433"),
        rfSniffer = rpi433.sniffer({
            pin: 2,                     //Snif on GPIO 2 (or Physical PIN 13)
            debounceDelay: 500          //Wait 500ms before reading another code
        });

    const twilio = require("twilio");


    const client = twilio(twilioSettings.data.value.accountsid, twilioSettings.data.value.authtoken);

    // Receive (data is like {code: xxx, pulseLength: xxx})
    rfSniffer.on("data", function(data: RFData) {
        console.log("---------------------------------");
        console.log(data);
        console.log("[BackDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
        _settingsDal.getSettingsByKey("backdoor").then((backdoorSettings: any) => {
          console.log("BackDoor Settings");
          console.log(backdoorSettings);
          if (+(data.code) === +(config.get("api.backdoor.sensor.receivercode"))) {
              // Send the text message.
              console.log("Code Match Found. Now sending Text");
              client.sendMessage({
                  to: "" + config.get("api.twilio.textto"),
                  from: "" + config.get("api.twilio.textfrom"),
                  body: "" + config.get("api.backdoor.sensor.message")
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
