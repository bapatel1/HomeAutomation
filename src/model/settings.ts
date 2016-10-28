/// <reference path="../typings/modules/mongoose/index.d.ts" />

import * as mongoose from "mongoose";
//mongoose.connect("mongodb://bhavin1983:heck429sis957@ds061076.mlab.com:61076/homeautomation");

const settingsSchema = new mongoose.Schema({
  key: String,
  value: String
});

const Settings = mongoose.model("Settings", settingsSchema);
export = Settings;
