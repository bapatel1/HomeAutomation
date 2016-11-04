/// <reference path='../typings/tsd.d.ts' />
"use strict";
var exec = require("child_process").exec;
var rpio = require("rpio");
var config = require("config");
//const PIN = config.get("api.garage.pin");
var rpi433 = require("rpi-433"), rfSniffer = rpi433.sniffer({
    pin: 2,
    debounceDelay: 500 //Wait 500ms before reading another code
}), rfEmitter = rpi433.emitter({
    pin: 0,
    pulseLength: 186 //Send the code with a 350 pulse length
});
var RF = (function () {
    function RF() {
    }
    return RF;
}());
var Route;
(function (Route) {
    var Zap = (function () {
        function Zap() {
            var _this = this;
            this.transmit = function (onoff, action, code, button, res) {
                rfEmitter.sendCode(code, function (error, stdout) {
                    if (!error) {
                        console.log(stdout); //Should display code
                        res.send("(" + button + ") Switch " + action);
                    }
                });
            };
            this.button1 = function (req, res, next) {
                console.log("Button 1 is pressed.");
                //res.send (req.params);
                if (req.params.val === "1") {
                    var onCode = +(config.get("api.zap.button1.on.code"));
                    _this.transmit(+(req.params.val), "ON", onCode, "Button-1", res);
                }
                else {
                    var offCode = +(config.get("api.zap.button1.off.code"));
                    _this.transmit(+(req.params.val), "OFF", offCode, "Button-1", res);
                }
            };
            this.button2 = function (req, res, next) {
                console.log("Button 2 is pressed.");
                if (req.params.val === "1") {
                    var onCode = +(config.get("api.zap.button2.on.code"));
                    _this.transmit(+(req.params.val), "ON", onCode, "Button-2", res);
                }
                else {
                    var offCode = +(config.get("api.zap.button2.off.code"));
                    _this.transmit(+(req.params.val), "OFF", offCode, "Button-2", res);
                }
            };
            this.button3 = function (req, res, next) {
                console.log("Button 3 is pressed.");
                if (req.params.val === "1") {
                    var onCode = +(config.get("api.zap.button3.on.code"));
                    _this.transmit(+(req.params.val), "ON", onCode, "Button-3", res);
                }
                else {
                    var offCode = +(config.get("api.zap.button3.off.code"));
                    _this.transmit(+(req.params.val), "OFF", offCode, "Button-3", res);
                }
            };
            this.button4 = function (req, res, next) {
                console.log("Button 4 is pressed.");
                if (req.params.val === "1") {
                    var onCode = +(config.get("api.zap.button4.on.code"));
                    _this.transmit(+(req.params.val), "ON", onCode, "Button-4", res);
                }
                else {
                    var offCode = +(config.get("api.zap.button4.off.code"));
                    _this.transmit(+(req.params.val), "OFF", offCode, "Button-4", res);
                }
            };
            this.button5 = function (req, res, next) {
                console.log("Button 5 is pressed.");
                if (req.params.val === "1") {
                    var onCode = +(config.get("api.zap.button5.on.code"));
                    _this.transmit(+(req.params.val), "ON", onCode, "Button-5", res);
                }
                else {
                    var offCode = +(config.get("api.zap.button5.off.code"));
                    _this.transmit(+(req.params.val), "OFF", offCode, "Button-5", res);
                }
            };
        }
        Zap.prototype.sniffer = function (req, res, next) {
            rfSniffer.on("data", function (data) {
                console.log("Code received: " + data.code + " pulse length : " + data.pulseLength);
            });
        };
        return Zap;
    }());
    Route.Zap = Zap;
})(Route || (Route = {}));
module.exports = Route;
