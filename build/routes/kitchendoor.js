/// <reference path='../typings/tsd.d.ts' />
"use strict";
// import * as settingsDal from "../data/settings_dal";
// const _settingsDal = new settingsDal.SettingsDAL();
var twilio = require("twilio");
var config = require("config");
var PIN = config.get("api.kitchendoor.pin");
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
var Route;
(function (Route) {
    var KitchenDoor = (function () {
        function KitchenDoor() {
        }
        return KitchenDoor;
    }());
    Route.KitchenDoor = KitchenDoor;
})(Route || (Route = {}));
module.exports = Route;
