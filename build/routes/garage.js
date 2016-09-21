/// <reference path='../typings/tsd.d.ts' />
"use strict";
var exec = require('child_process').exec;
//rpi-gpio Setup
var gpio = require("../helpers/rpi-gpio.js");
gpio.setup(7, gpio.DIR_OUT);
var Route;
(function (Route) {
    var Garage = (function () {
        function Garage() {
        }
        //using rpi-gpio
        Garage.prototype.on1 = function (req, res, next) {
            //res.json("{title:'garage', message:'ON: Garage'}");
            gpio.write(7, true, function (err) {
                if (err) {
                    console.log('Error writing to pin while opening.');
                    return res.json("Error - (Garage-OPEN): ${err}");
                }
                else {
                    console.log('Written to pin. Now closing the pin after 2 sec!');
                    setTimeout(function () {
                        console.log('closing the pin now.');
                        gpio.write(7, false, function (err) {
                            if (err) {
                                console.log('Error writing to pin while closing.');
                                return res.json("Error - (Garage-CLOSE): ${err}");
                            }
                            else {
                                gpio.setup(7, gpio.DIR_OUT);
                                return res.json("Success:Garage ON closed & finished.");
                            }
                        });
                    }, 1500);
                }
            });
            //return res.json("Success:Garage ON finished.");
        };
        Garage.prototype.on = function (req, res, next) {
            //res.json("{title:'garage', message:'OFF: Garage'}");
            gpio.write(7, true, function (err) {
                if (err)
                    console.log('Error writing to pin');
                console.log('Written to pin');
            });
            return res.json("Success:Garage ON finished.");
        };
        Garage.prototype.off = function (req, res, next) {
            //res.json("{title:'garage', message:'OFF: Garage'}");
            gpio.write(7, false, function (err) {
                if (err)
                    console.log('Error writing to pin');
                console.log('Written to pin');
            });
            return res.json("Success:Garage OFF finished.");
        };
        Garage.prototype.takepicture = function (req, res, next) {
            var child = exec('fswebcam -r 1280×720 image.jpg', function (error, stdout, stderr) {
                if (error)
                    console.log(error);
                res.json(stdout);
                process.stderr.write(stderr);
            });
            //res.json("{title:'index', message:'ON: Index'}");
        };
        return Garage;
    }());
    Route.Garage = Garage;
})(Route || (Route = {}));
module.exports = Route;
