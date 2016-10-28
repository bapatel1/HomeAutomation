/// <reference path="../typings/modules/mongoose/index.d.ts" />

import * as mongoose from "mongoose";
import * as Settings from "../model/settings";

class SettingsTable {
  key: String;
  value: String;
}
export class SettingsDAL {

    public _settings = new Settings();

    getSettings() {
        Settings.find({}, (err: any, results: any) => {
            if (err) {
                return { info: "error during find settings", error: err };
            } else {
                console.log(results);
                return { info: "Settings found successfully", data: results };
            }
        });
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
                }
            });
        } catch (e) {
            throw e;
        }
    }
}

// results.save ( (err: any) => {
//   if (err) {
//       return {info: "Error during updating settings by key", error: err};
//   } else {
//       return {info: "Settings Override successfully", data: key};
//   }
// });
