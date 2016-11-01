/// <reference path="../typings/modules/mongoose/index.d.ts" />
"use strict";
var Settings = require("../model/settings");
var SettingsTable = (function () {
    function SettingsTable() {
    }
    return SettingsTable;
}());
var SettingsDAL = (function () {
    function SettingsDAL() {
        this._settings = new Settings();
    }
    SettingsDAL.prototype.getSettingsByKey = function (key) {
        try {
            Settings.findOne({ key: key }, function (err, results) {
                if (err) {
                    return { info: "Error during find settings by KEY", error: err };
                }
                else {
                    console.log(results);
                    return { info: "Settings by KEY found successfully ", data: results };
                }
            });
        }
        catch (e) {
            return { info: "Exception during find settings by KEY", error: e.message };
        }
    };
    SettingsDAL.prototype.getSettings = function () {
        try {
            Settings.find({}, function (err, results) {
                if (err) {
                    return { info: "error during find settings", error: err };
                }
                else {
                    console.log(results);
                    return { info: "Settings found successfully", data: results };
                }
            });
        }
        catch (e) {
            return { info: "Exception during find settings", error: e.message };
        }
    };
    SettingsDAL.prototype.overrideSettings = function (key, newvalue) {
        try {
            Settings.findOne({ key: key }, function (err, setting) {
                if (err) {
                    return { info: "Error during find settings by key", error: err };
                }
                else {
                    console.log("Found record to Override...");
                    setting.value = newvalue;
                    console.log(setting);
                    setting.save();
                    return { info: "Successfully override settings", data: setting };
                }
            });
        }
        catch (e) {
            return { info: "Exception during find settings by key", error: e.message };
        }
    };
    return SettingsDAL;
}());
exports.SettingsDAL = SettingsDAL;
