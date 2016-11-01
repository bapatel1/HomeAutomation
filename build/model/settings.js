/// <reference path="../typings/modules/mongoose/index.d.ts" />
"use strict";
var mongoose = require("mongoose");
//mongoose.connect("mongodb://bhavin1983:heck429sis957@ds061076.mlab.com:61076/homeautomation");
var settingsSchema = new mongoose.Schema({
    key: String,
    value: Object
});
var Settings = mongoose.model("settings", settingsSchema);
module.exports = Settings;
