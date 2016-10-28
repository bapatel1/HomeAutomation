/// <reference path="../typings/modules/mongoose/index.d.ts" />

import * as mongoose from "mongoose";
import * as Settings from "../model/settings";

class SettingsTable {
  key: String;
  value: String;
}
export class SettingsDAL {

    public _settings = new Settings();

    getSettingsByKey(key: string) {
      try {
        Settings.findOne({key: key}, (err: any, results: any) => {
            if (err) {
                return { info: "Error during find settings by KEY", error: err };
            } else {
                console.log(results);
                return { info: "Settings by KEY found successfully ", data: results };
            }
        });
      } catch (e) {
        return {info: "Exception during find settings by KEY", error: e.message};
      }
    }


    getSettings() {
      try {
        Settings.find({}, (err: any, results: any) => {
            if (err) {
                return { info: "error during find settings", error: err };
            } else {
                console.log(results);
                return { info: "Settings found successfully", data: results };
            }
        });
      } catch (e) {
        return {info: "Exception during find settings", error: e.message};
      }
    }

    overrideSettings(key: string, newvalue: any) {
        try {
            Settings.findOne({ key: key }, (err: any, setting: any) => {
                if (err) {
                    return { info: "Error during find settings by key", error: err };
                } else {
                    console.log("Found record to Override...");
                    setting.value = newvalue;
                    console.log(setting);
                    setting.save();
                    return {info: "Successfully override settings", data : setting};
                }
            });
        } catch (e) {
            return {info: "Exception during find settings by key", error: e.message};
        }
    }
}
