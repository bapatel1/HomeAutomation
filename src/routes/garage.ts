/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as events from "events";
import * as fs from "fs";
import * as path from "path";

const exec = require('child_process').exec;

const gpio = require("../helpers/rpi-gpio.js");
gpio.setup(7, gpio.DIR_OUT);

gpio.read(7, function(err:Error, value:string) {
        console.log('The value is ' + value);
});

module Route {
    export class Garage {
        on(req: express.Request, res: express.Response, next: express.NextFunction) {

            gpio.write(7, true, function(err: Error) {
                if (err) {
                    console.log('Error writing to pin. ' + err);
                    return res.json(err);
                }
                else {
                    console.log('Written to pin');
                    setTimeout(() => {
                        gpio.write(7,false,(err:Error)=>{ console.log("Relay pin is closed now.")})
                    }, 1500);
                    return res.json("Success:Garage ON finished.");
                }
            });
        }

        off(req: express.Request, res: express.Response, next: express.NextFunction) {
            gpio.write(7, false, function(err: Error) {
                if (err) {
                    console.log('Error writing to pin');
                    return res.json(err);
                }
                else {
                    console.log('Written to pin');
                    return res.json("Success:Garage OFF finished.");
                }
            });
        }

        takepicture(req: express.Request, res: express.Response, next: express.NextFunction) {
            let child = exec('fswebcam -r 1280×720 garage.jpg', function(error: Error, stdout: Buffer, stderr: Buffer) {
                if (error)
                    console.log(error);
                else {
                    res.set({
                        "Content-Disposition": "attachment; filename=garage.jpg",
                        "content-type": "image/jpg"
                    });
                    return res.sendFile(path.resolve(__dirname + "/../../garage.jpg"));
                }
            });
        }
    }
}
export = Route;
