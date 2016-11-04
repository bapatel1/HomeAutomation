/// <reference path='../typings/tsd.d.ts' />
"use strict";
var twilio = require("twilio");
var RFData = (function () {
    function RFData() {
    }
    return RFData;
}());
var rpi433 = require("rpi-433"), rfSniffer = rpi433.sniffer({
    pin: 2,
    debounceDelay: 500 //Wait 500ms before reading another code
});
//Setting DataAccessLayer Code
var settingsDal = require("../data/settings_dal");
var _settingsDal = new settingsDal.SettingsDAL();
var _settings = _settingsDal.getSettingsByKey("twilio").then(function (twilioSettings) {
    //console.log(twilioSettings);
    //console.log(twilioSettings.data);
    //Twilio registration
    var client = twilio(twilioSettings.data.value.accountsid, twilioSettings.data.value.authtoken);
    // Receive (data is like {code: xxx, pulseLength: xxx})
    rfSniffer.on("data", function (data) {
        //console.log("---------------------------------");
        //console.log(data);
        //console.log("[BackDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
        _settingsDal.getSettingsByKey("backdoor").then(function (backdoorSettings) {
            //console.log("BackDoor Settings");
            //console.log(backdoorSettings);
            if (+(data.code) === +(backdoorSettings.data.value.sensor.receivercode)) {
                // Send the text message.
                console.log("[Back Door]  Code Match Found. Now sending Text");
                console.log(twilioSettings.data.value.textto + "      " + twilioSettings.data.value.textfrom);
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
