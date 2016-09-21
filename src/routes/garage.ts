/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as events from "events";
import * as fs from "fs";

const exec = require('child_process').exec;

const gpio = require("../helpers/rpi-gpio.js");
gpio.setup(7, gpio.DIR_OUT);

module Route {

    export class Garage {
        // function to encode file data to base64 encoded string
        public base64_encode(file: string) {
            // read binary data
            var bitmap = fs.readFileSync(file);
            // convert binary data to base64 encoded string
            return new Buffer(bitmap).toString('base64');
        }

        // function to create file from base64 encoded string
        public base64_decode(base64str: string, file: string) {
            // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
            var bitmap = new Buffer(base64str, 'base64');
            // write buffer to file
            fs.writeFileSync(file, bitmap);
            console.log('******** File created from base64 encoded string ********');
        }

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
                    });
                    return res.sendFile("../../garage.jpg", { root: __dirname });
                    // res.sendFile("../../garage.jpg", { root: __dirname });
                    //process.stderr.write(stderr);
                }
            });
        }
    }
}
export = Route;
