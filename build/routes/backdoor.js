/// <reference path='../typings/tsd.d.ts' />
"use strict";
//Setting DataAccessLayer Code
var settingsDal = require("../data/settings_dal");
var _settingsDal = new settingsDal.SettingsDAL();
var _settings = _settingsDal.getSettings();
//---------------------------------------------------
var config = require("config");
var PIN = config.get("api.backdoor.pin");
/* Following code is for reading garage door sensor
 We have RF 433Mhz Door sensor for Garaga Door.
 We are using Libaray called- "rpi-433".
 Now, Once sensor sniff correct sensor code,
 We are using Twilio to send SMS/Text to cellphone.
 Every values are in config.
 */
var RFData = (function () {
    function RFData() {
    }
    return RFData;
}());
var rpi433 = require("rpi-433"), rfSniffer = rpi433.sniffer({
    pin: 2,
    debounceDelay: 500 //Wait 500ms before reading another code
});
var twilio = require("twilio");
var client = twilio(config.get("api.twilio.accountsid"), config.get("api.twilio.authtoken"));
// Receive (data is like {code: xxx, pulseLength: xxx})
rfSniffer.on("data", function (data) {
    console.log("---------------------------------");
    console.log(data);
    console.log("[BackDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
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
