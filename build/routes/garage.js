/// <reference path='../typings/tsd.d.ts' />
"use strict";
var path = require("path");
var exec = require("child_process").exec;
var rpio = require("rpio");
var config = require("config");
console.log("Config value - ");
console.log(config.get("api.garage.pin"));
// const gpio = require("../helpers/rpi-gpio.js");
// gpio.setup(7, gpio.DIR_OUT);
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
            rpio.open(7, rpio.OUTPUT);
            tasks.push({ message: "Setting PIN for HIGH/1", created: new Date() });
            console.log("Setting PIN for HIGH/1");
            rpio.write(7, rpio.HIGH);
            tasks.push({ message: "Waiting 1 sec.", created: new Date() });
            console.log("Waiting 1 sec.");
            rpio.msleep(1000);
            tasks.push({ message: "Setting PIN for LOW/0", created: new Date() });
            console.log("Setting PIN for LOW/0");
            rpio.write(7, rpio.LOW);
            tasks.push({ message: "Finishing Garage Door Operations", created: new Date() });
            return res.json(tasks);
        };
        Garage.prototype.off = function (req, res, next) {
            // gpio.write(7, false, function(err: Error) {
            //     if (err) {
            //         console.log('Error writing to pin');
            //         return res.json(err);
            //     }
            //     else {
            //         console.log('Written to pin');
            //         return res.json("Success:Garage OFF finished.");
            //     }
            // });
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
