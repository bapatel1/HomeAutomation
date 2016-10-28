/// <reference path="../typings/modules/mongoose/index.d.ts" />

import * as mongoose from "mongoose";
import * as Settings from "../model/settings";
mongoose.connect("mongodb://bhavin1983:heck429sis957@ds061076.mlab.com:61076/homeautomation");

export class SettingsDAL {

  public _settings = new Settings();

  getSettings() {
    Settings.find(err: any, results: any) {
      if (err) {
        return {info: "error during find settings", error: err};
      } else {
        return {info: "Settings found successfully", data: results};
      }
    }
  }
}
