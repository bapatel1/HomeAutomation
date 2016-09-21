/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as events from "events";
const exec = require('child_process').exec;

const gpio = require("../helpers/rpi-gpio.js");
gpio.setup(7, gpio.DIR_OUT);
gpio.output(7, false);

module Route {
    export class Garage {
        on(req: express.Request, res: express.Response, next: express.NextFunction) {
            gpio.write(7, true, function(err: Error) {
                if (err) {
                    console.log('Error writing to pin');
                    return res.json(err);
                }
                else {
                    console.log('Written to pin');
                    setTimeout(() => {
                        gpio.destroy(function() {
                            console.log('All pins unexported');
                        });
                    }, 1500)
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
                    })
                    res.sendFile("garage.jpg", { root: __dirname });
                    process.stderr.write(stderr);
                }
            });
        }
    }
}
export = Route;
