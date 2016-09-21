/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as events from "events";
const exec = require('child_process').exec;

//rpi-gpio Setup
const gpio = require("../helpers/rpi-gpio.js");
gpio.setup(7, gpio.DIR_OUT);

module Route {
    export class Garage {
        on(req: express.Request, res: express.Response, next: express.NextFunction) {
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

        takepicture(req: express.Request, res: express.Response, next: express.NextFunction) {
            let child = exec('fswebcam -r 1280×720 image.jpg', function(error: Error, stdout: Buffer, stderr: Buffer) {
                if (error) console.log(error);
                res.json(stdout);
                process.stderr.write(stderr);
            });
        }
    }
}
export = Route;
