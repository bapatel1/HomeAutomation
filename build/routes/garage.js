/// <reference path='../typings/tsd.d.ts' />
"use strict";
var path = require("path");
var exec = require('child_process').exec;
var gpio = require("../helpers/rpi-gpio.js");
gpio.setup(7, gpio.DIR_OUT);
var Route;
(function (Route) {
    var Garage = (function () {
        function Garage() {
        }
        Garage.prototype.on = function (req, res, next) {
            gpio.write(7, true, function (err) {
                if (err) {
                    console.log('Error writing to pin. ' + err);
                    return res.json(err);
                }
                else {
                    console.log('Written to pin');
                    setTimeout(function () {
                        gpio.destroy(function () {
                            console.log('All pins unexported');
                        });
                        gpio.setup(7, gpio.DIR_OUT);
                    }, 1500);
                    return res.json("Success:Garage ON finished.");
                }
            });
        };
        Garage.prototype.off = function (req, res, next) {
            gpio.write(7, false, function (err) {
                if (err) {
                    console.log('Error writing to pin');
                    return res.json(err);
                }
                else {
                    console.log('Written to pin');
                    setTimeout(function () {
                        gpio.destroy(function () {
                            console.log('All pins unexported');
                        });
                        gpio.setup(7, gpio.DIR_OUT);
                    }, 1500);
                    return res.json("Success:Garage OFF finished.");
                }
            });
        };
        Garage.prototype.takepicture = function (req, res, next) {
            var child = exec('fswebcam -r 1280×720 garage.jpg', function (error, stdout, stderr) {
                if (error)
                    console.log(error);
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
