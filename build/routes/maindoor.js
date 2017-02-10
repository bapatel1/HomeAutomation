/// <reference path='../typings/tsd.d.ts' />
"use strict";
var twilio = require("twilio");
var config = require("config");
// import * as settingsDal from "../data/settings_dal";
// const _settingsDal = new settingsDal.SettingsDAL();
var RFData = (function () {
    function RFData() {
    }
    return RFData;
}());
var rpi433 = require("rpi-433"), rfSniffer = rpi433.sniffer({
    pin: 2,
    debounceDelay: 500 //Wait 500ms before reading another code
});
var client = twilio(config.get("twilio.accountsid"), config.get("twilio.authtoken"));
// Receive (data is like {code: xxx, pulseLength: xxx})
rfSniffer.on("data", function (data) {
    //console.log("---------------------------------");
    //console.log(data);
    //console.log("[MainDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
    if (+(data.code) === +(config.get("maindoor.receivercode"))) {
        // Send the text message.
        console.log("[Main Door]  Code Match Found. Now sending Text");
        console.log(config.get("twilio.textto") + "   ###   " + config.get("twilio.textfrom"));
        client.sendMessage({
            to: "" + config.get("twilio.textto"),
            from: "" + config.get("twilio.textfrom"),
            body: "Main door activity"
        });
        console.log("Text Sent!");
        console.log("---------------------------------");
    }
});
var Route;
(function (Route) {
    var MainDoor = (function () {
        function MainDoor() {
        }
        return MainDoor;
    }());
    Route.MainDoor = MainDoor;
})(Route || (Route = {}));
module.exports = Route;
