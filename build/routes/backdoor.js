/// <reference path='../typings/tsd.d.ts' />
"use strict";
//import * as settingsDal from "../data/settings_dal";
var twilio = require("twilio");
//const _settingsDal = new settingsDal.SettingsDAL();
var rpi433 = require("rpi-433");
var RFData = (function () {
    function RFData() {
    }
    return RFData;
}());
var rfSniffer = rpi433.sniffer({
    pin: 2,
    debounceDelay: 500 //Wait 500ms before reading another code
});
// let twilioSettings: any = null;
// const tSettings = _settingsDal.getSettingsByKey("twilio").then((twilioRes: any) => {
//     twilioSettings = twilioRes;
// });
// let backdoorSettings: any = null;
// const bSettings = _settingsDal.getSettingsByKey("backdoor").then((backdoorRes: any) => {
//     backdoorSettings = backdoorRes;
// });
rfSniffer.on("data", function (data) {
    console.log("Twilio Settings");
    //console.log(twilioSettings.data);
    //const client = twilio(twilioSettings.data.value.accountsid, twilioSettings.data.value.authtoken);
    //console.log(client);
    // Receive (data is like {code: xxx, pulseLength: xxx})
    console.log("---------------------------------");
    console.log(data);
    console.log("[BackDoor] Code received: " + data.code + " pulse length : " + data.pulseLength);
    console.log("BackDoor Settings");
    //pi.tsconsole.log(backdoorSettings);
    // if (+(data.code) === +(backdoorSettings.data.value.sensor.receivercode)) {
    //     // Send the text message.
    //     console.log("[Back Door]  Code Match Found. Now sending Text");
    //     console.log(twilioSettings.data.value.textto + "   ###   " + twilioSettings.data.value.textfrom);
    //     client.sendMessage({
    //         to: "" + twilioSettings.data.value.textto,
    //         from: "" + twilioSettings.data.value.textfrom,
    //         body: "" + backdoorSettings.data.value.sensor.message
    //     });
    //
    //     console.log("Text Sent!");
    //     console.log("---------------------------------");
    // };
});
var Route;
(function (Route) {
    var BackDoor = (function () {
        function BackDoor() {
        }
        return BackDoor;
    }());
    Route.BackDoor = BackDoor;
})(Route || (Route = {}));
module.exports = Route;
