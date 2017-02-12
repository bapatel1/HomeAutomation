/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
//import * as settingsDal from "../data/settings_dal";
const twilio = require("twilio");
//const _settingsDal = new settingsDal.SettingsDAL();
const rpi433 = require("rpi-433");
const config = require("config");


class RFData {
    code: string;
    pulseLength: string;
}

const rfSniffer = rpi433.sniffer({
    pin: 2,                     //Snif on GPIO 2 (or Physical PIN 13)
    debounceDelay: 1000          //Wait 500ms before reading another code
});


const client = twilio(config.get("twilio.accountsid"), config.get("twilio.authtoken"));

rfSniffer.on("data", function(data: RFData) {
    console.log("Twilio Settings");
    //console.log(twilioSettings.data);
    //const client = twilio(twilioSettings.data.value.accountsid, twilioSettings.data.value.authtoken);
    //console.log(client);
    // Receive (data is like {code: xxx, pulseLength: xxx})

    console.log("---------------------------------");
    console.log(data);
    console.log("[BackDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
    console.log("BackDoor Settings");
    //pi.tsconsole.log(backdoorSettings);
    if (+(data.code) === +(config.get("backdoor.receivercode"))) {
        // Send the text message.
        console.log("[Back Door]  Code Match Found. Now sending Text");
        this.router = express.Router();
         const updateValue = 0;
         this.router.get("http://localhost:3000/backdoor", (req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log("###>" + res);
         });
        console.log(config.get("twilio.textto") + "   ###   " + config.get("twilio.textfrom"));
        client.sendMessage({
            to: "" + config.get("twilio.textto"),
            from: "" + config.get("twilio.textfrom"),
            body: "Back door activity"
        });
        console.log("Text Sent!");
        console.log("---------------------------------");
    };
});
module Route {
    export class BackDoor {
        //Nothing goes here as this class basically have to just listen RF door sensors
    }
}
export = Route;
