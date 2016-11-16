"use strict";
var Settings = require("../model/settings");
var Q = require("q");
// class SettingsTable {
//   key: String;
//   value: String;
// }
var ReturnObject = (function () {
    function ReturnObject() {
    }
    return ReturnObject;
}());
var SettingsDAL = (function () {
    function SettingsDAL() {
        this._settings = new Settings();
        this._return = new ReturnObject();
    }
    SettingsDAL.prototype.getSettingsByKey = function (key) {
        var _this = this;
        var q = Q.defer();
        try {
            Settings.findOne({ key: key }, function (err, results) {
                if (err) {
                    _this._return.info = "Error during getting all settings by key";
                    _this._return.error = err;
                    q.reject(_this._return);
                }
                else {
                    console.log(results);
                    _this._return.info = "Settings by KEY found successfully";
                    _this._return.data = results;
                    q.resolve(_this._return);
                }
            });
        }
        catch (e) {
            this._return.info = "Exception during find settings by KEY";
            this._return.error = e.message;
            q.reject(this._return);
        }
        return q.promise;
    };
    SettingsDAL.prototype.getSettings = function () {
        var _this = this;
        var q = Q.defer();
        try {
            Settings.find({}, function (err, results) {
                if (err) {
                    _this._return.info = "Error during find settings";
                    _this._return.error = err;
                    q.reject(_this._return);
                }
                else {
                    console.log(results);
                    _this._return.info = "Settings found successfully";
                    _this._return.data = results;
                    q.resolve(_this._return);
                }
            });
        }
        catch (e) {
            this._return.info = "Exception during find settings";
            this._return.error = e.message;
            q.reject(this._return);
        }
        return q.promise;
    };
    SettingsDAL.prototype.overrideSettings = function (key, newvalue) {
        var _this = this;
        var q = Q.defer();
        try {
            Settings.findOne({ key: key }, function (err, setting) {
                if (err) {
                    _this._return.info = "Error during find settings by key to override";
                    _this._return.error = err;
                    q.reject(_this._return);
                }
                else {
                    console.log("Found record to Override");
                    setting.value = newvalue;
                    console.log(setting);
                    setting.save();
                    _this._return.info = "Successfully override settings";
                    _this._return.data = setting;
                    q.resolve(_this._return);
                }
            });
        }
        catch (e) {
            this._return.info = "Exception during find override settings by KEY";
            this._return.error = e.message;
            q.reject(this._return);
        }
        return q.promise;
    };
    return SettingsDAL;
}());
exports.SettingsDAL = SettingsDAL;
