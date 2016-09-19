/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as events from "events";

//rpi-gpio Setup
const gpio = require("../helpers/rpi-gpio.js");
gpio.setup(7, gpio.DIR_OUT);

module Route {
    export class Garage {
        //using rpi-gpio
        on(req: express.Request, res: express.Response, next: express.NextFunction) {
            //res.json("{title:'garage', message:'ON: Garage'}");
            gpio.write(7, true, function(err: Error) {
                if (err) console.log('Error writing to pin');
                console.log('Written to pin');
            });
            return res.json("Success:Garage ON finished.");
        }

        off(req: express.Request, res: express.Response, next: express.NextFunction) {
            //res.json("{title:'garage', message:'OFF: Garage'}");
            gpio.write(7, false, function(err: Error) {
                if (err) console.log('Error writing to pin');
                console.log('Written to pin');
            });
            return res.json("Success:Garage OFF finished.");
        }
    }
}
export = Route;
