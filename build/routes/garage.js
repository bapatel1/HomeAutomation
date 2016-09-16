/// <reference path='../typings/tsd.d.ts' />
"use strict";
//rpi-gpio Setup
var gpio = require("../helpers/rpi-gpio.js");
gpio.setup(7, gpio.DIR_OUT);
//johnny-five setup
var five = require("johnny-five");
var board = new five.Board();
var Route;
(function (Route) {
    var Garage = (function () {
        function Garage() {
        }
        //using rpi-gpio
        Garage.prototype.on = function (req, res, next) {
            //res.json("{title:'garage', message:'ON: Garage'}");
            gpio.write(7, true, function (err) {
                if (err)
                    console.log('Error writing to pin');
                console.log('Written to pin');
            });
        };
        Garage.prototype.off = function (req, res, next) {
            //res.json("{title:'garage', message:'OFF: Garage'}");
            gpio.write(7, false, function (err) {
                if (err)
                    console.log('Error writing to pin');
                console.log('Written to pin');
            });
        };
        //using johnny-five
        Garage.prototype.on1 = function (req, res, next) {
            //res.json("{title:'garage', message:'ON: Garage'}");
            board.on("ready", function () {
                var relay = new five.Relay(7);
                console.log(relay.type);
                relay.on();
                this.repl.inject({ relay: relay });
            });
        };
        Garage.prototype.off1 = function (req, res, next) {
            //res.json("{title:'garage', message:'OFF: Garage'}");
            board.on("ready", function () {
                var relay = new five.Relay({
                    type: "NC",
                    pin: 7
                });
                console.log(relay.type);
                relay.off();
                this.repl.inject({ relay: relay });
            });
        };
        return Garage;
    }());
    Route.Garage = Garage;
})(Route || (Route = {}));
module.exports = Route;
