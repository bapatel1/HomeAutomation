/// <reference path='../typings/tsd.d.ts' />
"use strict";
var path = require("path");
var settingsDal = require("../data/settings_dal");
var _settingsDal = new settingsDal.SettingsDAL();
var exec = require("child_process").exec;
var rpio = require("rpio");
var rpi433 = require("rpi-433"), rfSniffer = rpi433.sniffer({
    pin: 2,
    debounceDelay: 500 //Wait 500ms before reading another code
});
var twilio = require("twilio");
var config = require("config");
// PIN = config.get("api.garage.pin");
var PIN = null;
_settingsDal.getSettingsByKey("garage").then(function (garageSettings) {
    console.log("Garage PIN = " + garageSettings.data.value.pin);
    PIN = garageSettings.data.value.pin;
});
var RFData = (function () {
    function RFData() {
    }
    return RFData;
}());
var Task = (function () {
    function Task() {
    }
    return Task;
}());
var _settings = _settingsDal.getSettingsByKey("twilio").then(function (twilioSettings) {
    console.log(twilioSettings);
    console.log(twilioSettings.data);
    //Twilio registration
    var client = twilio(twilioSettings.data.value.accountsid, twilioSettings.data.value.authtoken);
    // Receive (data is like {code: xxx, pulseLength: xxx})
    rfSniffer.on("data", function (data) {
        console.log("---------------------------------");
        console.log(data);
        console.log("[GarageDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
        _settingsDal.getSettingsByKey("garage").then(function (garageSettings) {
            if (+(data.code) === +(garageSettings.data.value.sensor.receivercode)) {
                // Send the text message.
                console.log("Code Match Found. Now sending Text");
                client.sendMessage({
                    to: "" + twilioSettings.data.value.textto,
                    from: "" + twilioSettings.data.value.textfrom,
                    body: "" + garageSettings.data.value.sensor.message
                });
                console.log("Text Sent!");
                console.log("---------------------------------");
            }
        });
    });
});
//*******************************************************************
//GPIO Library used - https://github.com/jperkin/node-rpio
//*******************************************************************
var Route;
(function (Route) {
    var Garage = (function () {
        function Garage() {
        }
        Garage.prototype.on = function (req, res, next) {
            console.log("Inside on/off with PIN = " + PIN);
            var tasks = [];
            tasks.push({ message: "Initializing PIN for OUTPUT", created: new Date() });
            console.log("initializing PIN for OUTPUT");
            rpio.open(PIN, rpio.OUTPUT);
            tasks.push({ message: "Setting PIN for HIGH/1", created: new Date() });
            console.log("Setting PIN for HIGH/1");
            rpio.write(PIN, rpio.HIGH);
            tasks.push({ message: "Waiting 1 sec.", created: new Date() });
            console.log("Waiting 1 sec.");
            rpio.msleep(1000);
            tasks.push({ message: "Setting PIN for LOW/0", created: new Date() });
            console.log("Setting PIN for LOW/0");
            rpio.write(PIN, rpio.LOW);
            tasks.push({ message: "Finishing Garage Door Operations", created: new Date() });
            return res.json(tasks);
        };
        Garage.prototype.takepicture = function (req, res, next) {
            var child = exec("fswebcam -r 1280×720 garage.jpg", function (error, stdout, stderr) {
                if (error) {
                    console.log(error);
                }
                else {
                    res.set({
                        "Content-Disposition": "attachment; filename=garage.jpg",
                        "content-type": "image/jpg"
                    });
                    return res.sendFile(path.resolve(__dirname + "/../../garage.jpg"));
                }
            });
        };
        return Garage;
    }());
    Route.Garage = Garage;
})(Route || (Route = {}));
module.exports = Route;
