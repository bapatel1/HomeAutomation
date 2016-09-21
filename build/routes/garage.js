/// <reference path='../typings/tsd.d.ts' />
"use strict";
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
                if (err)
                    console.log('Error writing to pin');
                console.log('Written to pin');
            });
            return res.json("Success:Garage ON finished.");
        };
        Garage.prototype.off = function (req, res, next) {
            gpio.write(7, false, function (err) {
                if (err)
                    console.log('Error writing to pin');
                console.log('Written to pin');
            });
            return res.json("Success:Garage OFF finished.");
        };
        Garage.prototype.takepicture = function (req, res, next) {
            var child = exec('fswebcam -r 1280×720 garage.jpg', function (error, stdout, stderr) {
                if (error)
                    console.log(error);
                res.sendFile("../../garage.jpg");
                process.stderr.write(stderr);
            });
        };
        return Garage;
    }());
    Route.Garage = Garage;
})(Route || (Route = {}));
module.exports = Route;
