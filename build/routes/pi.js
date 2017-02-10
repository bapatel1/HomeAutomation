/// <reference path='../typings/tsd.d.ts' />
"use strict";
var exec = require("child_process").exec;
var si = require("systeminformation");
var Route;
(function (Route) {
    var Pi = (function () {
        function Pi() {
        }
        Pi.prototype.cpu = function (req, res, next) {
            // promises style - new in version 3
            si.cpu()
                .then(function (data) { return res.json(data); })
                .catch(function (error) { console.error(error); res.json(error); });
        };
        Pi.prototype.time = function (req, res, next) {
            si.time()
                .then(function (data) { return res.json(data); })
                .catch(function (error) { console.error(error); res.json(error); });
        };
        Pi.prototype.cputemp = function (req, res, next) {
            si.cpuTemperature()
                .then(function (data) { return res.json(data); })
                .catch(function (error) { console.error(error); res.json(error); });
        };
        Pi.prototype.linuxversion = function (req, res, next) {
            si.osInfo()
                .then(function (data) { return res.json(data); })
                .catch(function (error) { console.error(error); res.json(error); });
        };
        Pi.prototype.memory = function (req, res, next) {
            si.mem()
                .then(function (data) { return res.json(data); })
                .catch(function (error) { console.error(error); res.json(error); });
        };
        Pi.prototype.networkinfo = function (req, res, next) {
            si.networkInterfaces()
                .then(function (data) { return res.json(data); })
                .catch(function (error) { console.error(error); res.json(error); });
        };
        Pi.prototype.systeminfo = function (req, res, next) {
            si.system()
                .then(function (data) { return res.json(data); })
                .catch(function (error) { console.error(error); res.json(error); });
        };
        Pi.prototype.restart = function (req, res, next) {
            //res.json("{title:'index', message:'OFF: Index'}");
            var child = exec("sudo shutdown -r now", function (error, stdout, stderr) {
                if (error) {
                    console.log(error);
                }
                res.json(stdout);
                process.stderr.write(stderr);
            });
        };
        Pi.prototype.shutdown = function (req, res, next) {
            //res.json("{title:'index', message:'OFF: Index'}");
            var child = exec("sudo shutdown -h now", function (error, stdout, stderr) {
                if (error) {
                    console.log(error);
                }
                res.json(stdout);
                process.stderr.write(stderr);
            });
        };
        return Pi;
    }());
    Route.Pi = Pi;
})(Route || (Route = {}));
module.exports = Route;
