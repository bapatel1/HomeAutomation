/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as events from "events";
import * as fs from "fs";
import * as path from "path";

const exec = require("child_process").exec;
const rpio = require("rpio");
// const gpio = require("../helpers/rpi-gpio.js");
// gpio.setup(7, gpio.DIR_OUT);
class Task {
  message:    string;
  created: Date;
}
//*******************************************************************
//GPIO Library used - https://github.com/jperkin/node-rpio
//*******************************************************************
module Route {
    export class Garage {
        on(req: express.Request, res: express.Response, next: express.NextFunction) {
            const tasks: Task[] = [];
            tasks.push({message: "Initializing PIN for OUTPUT", created: new Date()});
            console.log("initializing PIN for OUTPUT");
            rpio.open(7, rpio.OUTPUT);
            tasks.push({message: "Setting PIN for HIGH/1", created: new Date()});
            console.log("Setting PIN for HIGH/1");
            rpio.write(7, rpio.HIGH);
            tasks.push({message: "Waiting 1 sec.", created: new Date()});
            console.log("Waiting 1 sec.");
            rpio.msleep(1000);
            tasks.push({message: "Setting PIN for LOW/0", created: new Date()});
            console.log("Setting PIN for LOW/0");
            rpio.write(7, rpio.LOW);
            tasks.push({message: "Finishing Garage Door Operations", created: new Date()});

            return res.json(tasks);
        }

        off(req: express.Request, res: express.Response, next: express.NextFunction) {
            // gpio.write(7, false, function(err: Error) {
            //     if (err) {
            //         console.log('Error writing to pin');
            //         return res.json(err);
            //     }
            //     else {
            //         console.log('Written to pin');
            //         return res.json("Success:Garage OFF finished.");
            //     }
            // });
        }

        takepicture(req: express.Request, res: express.Response, next: express.NextFunction) {
            let child = exec("fswebcam -r 1280×720 garage.jpg", function(error: Error, stdout: Buffer, stderr: Buffer) {
                if (error) {
                    console.log(error);
                }
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
