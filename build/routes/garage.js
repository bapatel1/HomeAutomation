/// <reference path='../typings/tsd.d.ts' />
"use strict";
var express = require("express");
var path = require("path");
var exec = require("child_process").exec;
// const rpio = require("rpio");
var rpi433 = require("rpi-433"), rfSniffer = rpi433.sniffer({
    pin: 2,
    debounceDelay: 500 //Wait 500ms before reading another code
});
var twilio = require("twilio");
var config = require("config");
// PIN = config.get("api.garage.pin");
var PIN = null;
// _settingsDal.getSettingsByKey("garage").then((garageSettings: any) => {
//     //console.log("Garage PIN = " + garageSettings.data.value.pin);
//     PIN = garageSettings.data.value.pin;
// });
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
var client = twilio(config.get("twilio.accountsid"), config.get("twilio.authtoken"));
// Receive (data is like {code: xxx, pulseLength: xxx})
rfSniffer.on("data", function (data) {
    //console.log("---------------------------------");
    //console.log(data);
    //console.log("[GarageDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
    if (+(data.code) === +(config.get("garage.receivercode"))) {
        // Send the text message.
        console.log("[Garage Door]  Code Match Found. Now updating database.");
        this.router = express.Router();
        var updateValue = 0;
        this.router.get("http://localhost:3000/garage", function (req, res, next) {
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
});
//*******************************************************************
//GPIO Library used - https://github.com/jperkin/node-rpio
//*******************************************************************
var Route;
(function (Route) {
    var Garage = (function () {
        function Garage() {
        }
        // on(req: express.Request, res: express.Response, next: express.NextFunction) {
        //     console.log("Inside on/off with PIN = " + PIN);
        //     const tasks: Task[] = [];
        //     tasks.push({ message: "Initializing PIN for OUTPUT", created: new Date() });
        //     console.log("initializing PIN for OUTPUT");
        //     rpio.open(PIN, rpio.OUTPUT);
        //     tasks.push({ message: "Setting PIN for HIGH/1", created: new Date() });
        //     console.log("Setting PIN for HIGH/1");
        //     rpio.write(PIN, rpio.HIGH);
        //     tasks.push({ message: "Waiting 1 sec.", created: new Date() });
        //     console.log("Waiting 1 sec.");
        //     rpio.msleep(1000);
        //     tasks.push({ message: "Setting PIN for LOW/0", created: new Date() });
        //     console.log("Setting PIN for LOW/0");
        //     rpio.write(PIN, rpio.LOW);
        //     tasks.push({ message: "Finishing Garage Door Operations", created: new Date() });
        //     return res.json(tasks);
        // }
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
