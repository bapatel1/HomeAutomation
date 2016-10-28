/// <reference path='../typings/tsd.d.ts' />
"use strict";
var path = require("path");
var exec = require("child_process").exec;
var rpio = require("rpio");
var config = require("config");
var PIN = config.get("api.garage.pin");
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
    console.log("[GarageDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
    if (+(data.code) === +(config.get("api.garage.sensor.receivercode"))) {
        // Send the text message.
        console.log("Code Match Found. Now sending Text");
        client.sendMessage({
            to: "" + config.get("api.twilio.textto"),
            from: "" + config.get("api.twilio.textfrom"),
            body: "" + config.get("api.garage.sensor.message")
        });
        console.log("Text Sent!");
        console.log("---------------------------------");
    }
});
var Task = (function () {
    function Task() {
    }
    return Task;
}());
//*******************************************************************
//GPIO Library used - https://github.com/jperkin/node-rpio
//*******************************************************************
var Route;
(function (Route) {
    var Garage = (function () {
        function Garage() {
        }
        Garage.prototype.on = function (req, res, next) {
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
