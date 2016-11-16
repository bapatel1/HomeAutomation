/// <reference path='../typings/tsd.d.ts' />
"use strict";
var twilio = require("twilio");
var settingsDal = require("../data/settings_dal");
var _settingsDal = new settingsDal.SettingsDAL();
var RFData = (function () {
    function RFData() {
    }
    return RFData;
}());
var rpi433 = require("rpi-433"), rfSniffer = rpi433.sniffer({
    pin: 2,
    debounceDelay: 500 //Wait 500ms before reading another code
});
var _settings = _settingsDal.getSettingsByKey("twilio").then(function (twilioSettings) {
    console.log(twilioSettings);
    console.log(twilioSettings.data);
    //Twilio registration
    var client = twilio(twilioSettings.data.value.accountsid, twilioSettings.data.value.authtoken);
    // Receive (data is like {code: xxx, pulseLength: xxx})
    rfSniffer.on("data", function (data) {
        console.log("---------------------------------");
        console.log(data);
        console.log("[MainDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
        _settingsDal.getSettingsByKey("maindoor").then(function (maindoorSettings) {
            console.log("MainDoor Settings");
            console.log(maindoorSettings);
            if (+(data.code) === +(maindoorSettings.data.value.sensor.receivercode)) {
                // Send the text message.
                console.log("Code Match Found. Now sending Text");
                client.sendMessage({
                    to: "" + twilioSettings.data.value.textto,
                    from: "" + twilioSettings.data.value.textfrom,
                    body: "" + maindoorSettings.data.value.sensor.message
                });
                console.log("Text Sent!");
                console.log("---------------------------------");
            }
        });
    });
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
