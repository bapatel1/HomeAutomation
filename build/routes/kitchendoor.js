/// <reference path='../typings/tsd.d.ts' />
"use strict";
var settingsDal = require("../data/settings_dal");
var _settingsDal = new settingsDal.SettingsDAL();
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
var _settings = _settingsDal.getSettingsByKey("twilio").then(function (twilioSettings) {
    console.log(twilioSettings);
    console.log(twilioSettings.data);
    //Twilio registration
    var client = twilio(twilioSettings.data.value.accountsid, twilioSettings.data.value.authtoken);
    // Receive (data is like {code: xxx, pulseLength: xxx})
    rfSniffer.on("data", function (data) {
        console.log("---------------------------------");
        console.log(data);
        console.log("[KitchenDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
        _settingsDal.getSettingsByKey("backdoor").then(function (kitchendoorSettings) {
            console.log("KitchenDoor Settings");
            console.log(kitchendoorSettings);
            if (+(data.code) === +(kitchendoorSettings.data.value.sensor.receivercode)) {
                // Send the text message.
                console.log("Code Match Found. Now sending Text");
                client.sendMessage({
                    to: "" + twilioSettings.data.value.textto,
                    from: "" + twilioSettings.data.value.textfrom,
                    body: "" + kitchendoorSettings.data.value.sensor.message
                });
                console.log("Text Sent!");
                console.log("---------------------------------");
            }
        });
    });
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
