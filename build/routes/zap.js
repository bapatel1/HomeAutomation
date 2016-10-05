/// <reference path='../typings/tsd.d.ts' />
"use strict";
var exec = require("child_process").exec;
var rpio = require("rpio");
var config = require("config");
var PIN = config.get("api.garage.pin");
var rpi433 = require("rpi-433"), rfEmitter = rpi433.emitter({
    pin: 0,
    pulseLength: 350 //Send the code with a 350 pulse length
});
var Route;
(function (Route) {
    var Zap = (function () {
        function Zap() {
        }
        Zap.prototype.button1 = function (req, res, next) {
            console.log("Button 1 is pressed.");
        };
        Zap.prototype.button2 = function (req, res, next) {
            console.log("Button 2 is pressed.");
        };
        Zap.prototype.button3 = function (req, res, next) {
            console.log("Button 3 is pressed.");
        };
        Zap.prototype.button4 = function (req, res, next) {
            console.log("Button 4 is pressed.");
        };
        Zap.prototype.button5 = function (req, res, next) {
            console.log("Button 5 is pressed.");
        };
        return Zap;
    }());
    Route.Zap = Zap;
})(Route || (Route = {}));
module.exports = Route;
