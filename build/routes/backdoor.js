/// <reference path='../typings/tsd.d.ts' />
"use strict";
var express = require("express");
//import * as settingsDal from "../data/settings_dal";
var twilio = require("twilio");
//const _settingsDal = new settingsDal.SettingsDAL();
var rpi433 = require("rpi-433");
var config = require("config");
var RFData = (function () {
    function RFData() {
    }
    return RFData;
}());
var rfSniffer = rpi433.sniffer({
    pin: 2,
    debounceDelay: 500 //Wait 500ms before reading another code
});
var client = twilio(config.get("twilio.accountsid"), config.get("twilio.authtoken"));
rfSniffer.on("data", function (data) {
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
        var updateValue = 0;
        this.router.get("http://localhost:3000/backdoor", function (req, res, next) {
            console.log("###>" + res);
        });
        console.log(config.get("twilio.textto") + "   ###   " + config.get("twilio.textfrom"));
        client.sendMessage({
            to: "" + config.get("twilio.textto"),
            from: "" + config.get("twilio.textfrom"),
            body: "Garage door activity"
        });
        console.log("Text Sent!");
        console.log("---------------------------------");
    }
    ;
});
var Route;
(function (Route) {
    var BackDoor = (function () {
        function BackDoor() {
        }
        return BackDoor;
    }());
    Route.BackDoor = BackDoor;
})(Route || (Route = {}));
module.exports = Route;
