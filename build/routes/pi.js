/// <reference path='../typings/tsd.d.ts' />
"use strict";
var exec = require('child_process').exec;
var Route;
(function (Route) {
    var Pi = (function () {
        function Pi() {
        }
        Pi.prototype.cpu = function (req, res, next) {
            var child = exec('cat /proc/cpuinfo', function (error, stdout, stderr) {
                if (error)
                    console.log(error);
                res.json(stdout);
                process.stderr.write(stderr);
            });
            //res.json("{title:'index', message:'ON: Index'}");
        };
        Pi.prototype.linuxversion = function (req, res, next) {
            //res.json("{title:'index', message:'OFF: Index'}");
            var child = exec('cat /proc/version', function (error, stdout, stderr) {
                if (error)
                    console.log(error);
                res.json(stdout);
                process.stderr.write(stderr);
            });
        };
        Pi.prototype.memory = function (req, res, next) {
            //res.json("{title:'index', message:'OFF: Index'}");
            var child = exec('cat /proc/meminfo', function (error, stdout, stderr) {
                if (error)
                    console.log(error);
                res.json(stdout);
                process.stderr.write(stderr);
            });
        };
        Pi.prototype.restart = function (req, res, next) {
            //res.json("{title:'index', message:'OFF: Index'}");
            var child = exec('sudo shutdown -r now', function (error, stdout, stderr) {
                if (error)
                    console.log(error);
                res.json(stdout);
                process.stderr.write(stderr);
            });
        };
        Pi.prototype.shutdown = function (req, res, next) {
            //res.json("{title:'index', message:'OFF: Index'}");
            var child = exec('sudo shutdown -h now', function (error, stdout, stderr) {
                if (error)
                    console.log(error);
                res.json(stdout);
                process.stderr.write(stderr);
            });
        };
        return Pi;
    }());
    Route.Pi = Pi;
})(Route || (Route = {}));
module.exports = Route;
