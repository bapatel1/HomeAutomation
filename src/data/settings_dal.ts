/// <reference path="../typings/modules/mongoose/index.d.ts" />

import * as mongoose from "mongoose";
import * as Settings from "../model/settings";
const Q = require("q");

// class SettingsTable {
//   key: String;
//   value: String;
// }

class ReturnObject {
    info: String;
    error: any;
    data: any;
}
export class SettingsDAL {

    public _settings = new Settings();
    public _return = new ReturnObject();
    getSettingsByKey(key: string) {
        const q = Q.defer();
        try {
            Settings.findOne({ key: key }, (err: any, results: any) => {
                if (err) {
                    this._return.info = "Error during getting all settings by key";
                    this._return.error = err;
                    q.reject(this._return);
                } else {
                    console.log(results);
                    this._return.info = "Settings by KEY found successfully";
                    this._return.data = results;
                    q.resolve(this._return);
                }
            });
        } catch (e) {
            this._return.info = "Exception during find settings by KEY";
            this._return.error = e.message;
            q.reject(this._return);
        }
        return q.promise;
    }


    getSettings() {
        const q = Q.defer();
        try {
            Settings.find({}, (err: any, results: any) => {
                if (err) {
                    this._return.info = "Error during find settings";
                    this._return.error = err;
                    q.reject(this._return);
                } else {
                    //console.log(results);
                    this._return.info = "Settings found successfully";
                    this._return.data = results;
                    q.resolve(this._return);
                }
            });
        } catch (e) {
            this._return.info = "Exception during find settings";
            this._return.error = e.message;
            q.reject(this._return);
        }
        return q.promise;
    }

    overrideSettings(key: string, newvalue: any) {
        const q = Q.defer();
        try {
            Settings.findOne({ key: key }, (err: any, setting: any) => {
                if (err) {
                    this._return.info = "Error during find settings by key to override";
                    this._return.error = err;
                    q.reject(this._return);
                } else {
                    //console.log("Found record to Override");
                    setting.value = newvalue;
                    //console.log(setting);
                    setting.save();
                    this._return.info = "Successfully override settings";
                    this._return.data = setting;
                    q.resolve(this._return);
                }
            });
        } catch (e) {
            this._return.info = "Exception during find override settings by KEY";
            this._return.error = e.message;
            q.reject(this._return);
        }
        return q.promise;
    }
}
