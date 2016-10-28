/// <reference path="../typings/modules/mongoose/index.d.ts" />
"use strict";
var mongoose = require("mongoose");
var Settings = require("../model/settings");
mongoose.connect("mongodb://bhavin1983:heck429sis957@ds061076.mlab.com:61076/homeautomation");
var SettingsDAL = (function () {
    function SettingsDAL() {
        this._settings = new Settings();
    }
    SettingsDAL.prototype.getSettings = function () {
        Settings.find({}, function (err, results) {
            if (err) {
                return { info: "error during find settings", error: err };
            }
            else {
                console.log(results);
                return { info: "Settings found successfully", data: results };
            }
        });
    };
    SettingsDAL.prototype.overrideSettings = function (key, newvalue) {
        try {
            Settings.find({ key: key }, function (err, results) {
                if (err) {
                    return { info: "Error during find settings by key", error: err };
                }
                else {
                    console.log("Found record to Override...");
                    results.value = newvalue;
                    results.save();
                }
            });
        }
        catch (e) {
            throw e;
        }
    };
    return SettingsDAL;
}());
exports.SettingsDAL = SettingsDAL;
// results.save ( (err: any) => {
//   if (err) {
//       return {info: "Error during updating settings by key", error: err};
//   } else {
//       return {info: "Settings Override successfully", data: key};
//   }
// });
