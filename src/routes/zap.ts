/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as events from "events";
import * as fs from "fs";
import * as path from "path";

const exec = require("child_process").exec;
const rpio = require("rpio");

const config = require("config");
const PIN = config.get("api.garage.pin");

var rpi433 = require("rpi-433"),
    rfEmitter = rpi433.emitter({
        pin: 0,                     //Send through GPIO 0 (or Physical PIN 11)
        pulseLength: 350            //Send the code with a 350 pulse length
    });

module Route {
    export class Zap {
        button1(req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log("Button 1 is pressed.");
            //res.send (req.params);
            if (req.params.val === "1") {
                rfEmitter.sendCode(4199731, function (error: string , stdout: any) {   //Send 1234
                    if (!error) {
                       console.log(stdout); //Should display code
                       res.send("Switch ON");
                     }
                });

            } else {
              rfEmitter.sendCode(4199740, function (error: string , stdout: any) {   //Send 1234
                  if (!error) {
                     console.log(stdout); //Should display code
                     res.send("Switch OFF");
                   }
              });
            }
        }

        button2(req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log("Button 2 is pressed.");
            if (req.params.val === "1") {
                rfEmitter.sendCode(4199875, function (error: string , stdout: any) {   //Send 1234
                    if (!error) {
                       console.log(stdout); //Should display code
                       res.send("Switch ON");
                     }
                });

            } else {
              rfEmitter.sendCode(4199884, function (error: string , stdout: any) {   //Send 1234
                  if (!error) {
                     console.log(stdout); //Should display code
                     res.send("Switch OFF");
                   }
              });
            }
        }

        button3(req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log("Button 3 is pressed.");
            if (req.params.val === "1") {
                rfEmitter.sendCode(4200195, function (error: string , stdout: any) {   //Send 1234
                    if (!error) {
                       console.log(stdout); //Should display code
                       res.send("Switch ON");
                     }
                });

            } else {
              rfEmitter.sendCode(4200204, function (error: string , stdout: any) {   //Send 1234
                  if (!error) {
                     console.log(stdout); //Should display code
                     res.send("Switch OFF");
                   }
              });
            }
        }

        button4(req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log("Button 4 is pressed.");
            if (req.params.val === "1") {
                rfEmitter.sendCode(4201731, function (error: string , stdout: any) {   //Send 1234
                    if (!error) {
                       console.log(stdout); //Should display code
                       res.send("Switch ON");
                     }
                });

            } else {
              rfEmitter.sendCode(4201740, function (error: string , stdout: any) {   //Send 1234
                  if (!error) {
                     console.log(stdout); //Should display code
                     res.send("Switch OFF");
                   }
              });
            }
        }

        button5(req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log("Button 5 is pressed.");
            if (req.params.val === "1") {
                rfEmitter.sendCode(4207875, function (error: string , stdout: any) {   //Send 1234
                    if (!error) {
                       console.log(stdout); //Should display code
                       res.send("Switch ON");
                     }
                });

            } else {
              rfEmitter.sendCode(4207884, function (error: string , stdout: any) {   //Send 1234
                  if (!error) {
                     console.log(stdout); //Should display code
                     res.send("Switch OFF");
                   }
              });
            }
        }
    }
}

export = Route;
