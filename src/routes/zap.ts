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

const rpi433 = require("rpi-433"),
    rfEmitter = rpi433.emitter({
        pin: 0,                     //Send through GPIO 0 (or Physical PIN 11)
        pulseLength: 350            //Send the code with a 350 pulse length
    });

module Route {
    export class Zap {
        transmit (code: number, button: string, res: express.Response) {
          rfEmitter.sendCode(code, function (error: string , stdout: any) {   //Send 1234
              if (!error) {
                 console.log(stdout); //Should display code
                 res.send("(" + button + ") Switch ON");
               }
          });
        }

        button1(req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log("Button 1 is pressed.");
            //res.send (req.params);
            if (req.params.val === "1") {
                const onCode = +(config.get("api.zap.button1.on.code"));
                // rfEmitter.sendCode(onCode, function (error: string , stdout: any) {   //Send 1234
                //     if (!error) {
                //        console.log(stdout); //Should display code
                //        res.send("(Button 1) Switch ON");
                //      }
                // });
                this.transmit (onCode, "Button-1", res);
            } else {
              const offCode = +(config.get("api.zap.button1.off.code"));
              // rfEmitter.sendCode(offCode, function (error: string , stdout: any) {   //Send 1234
              //     if (!error) {
              //        console.log(stdout); //Should display code
              //        res.send("(Button 1) Switch OFF");
              //      }
              // });
              this.transmit (offCode, "Button-1", res);
            }
        }

        button2(req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log("Button 2 is pressed.");
            if (req.params.val === "1") {
                const onCode = +(config.get("api.zap.button2.on.code"));
                // rfEmitter.sendCode(onCode, function (error: string , stdout: any) {   //Send 1234
                //     if (!error) {
                //        console.log(stdout); //Should display code
                //        res.send("(Button 2) Switch ON");
                //      }
                // });
                this.transmit (onCode, "Button-2", res);
            } else {
              const offCode = +(config.get("api.zap.button2.off.code"));
              // rfEmitter.sendCode(offCode, function (error: string , stdout: any) {   //Send 1234
              //     if (!error) {
              //        console.log(stdout); //Should display code
              //        res.send("(Button 2) Switch OFF");
              //      }
              // });
              this.transmit (offCode, "Button-2", res);
            }
        }

        button3(req: express.Request, res: express.Response, next: express.NextFunction) {
            console.log("Button 3 is pressed.");
            if (req.params.val === "1") {
                rfEmitter.sendCode(4200195, function (error: string , stdout: any) {   //Send 1234
                    if (!error) {
                       console.log(stdout); //Should display code
                       res.send("(Button 3) Switch ON");
                     }
                });

            } else {
              rfEmitter.sendCode(4200204, function (error: string , stdout: any) {   //Send 1234
                  if (!error) {
                     console.log(stdout); //Should display code
                     res.send("(Button 3) Switch OFF");
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
                       res.send("(Button 4) Switch ON");
                     }
                });

            } else {
              rfEmitter.sendCode(4201740, function (error: string , stdout: any) {   //Send 1234
                  if (!error) {
                     console.log(stdout); //Should display code
                     res.send("(Button 4) Switch OFF");
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
                       res.send("(Button 5) Switch ON");
                     }
                });

            } else {
              rfEmitter.sendCode(4207884, function (error: string , stdout: any) {   //Send 1234
                  if (!error) {
                     console.log(stdout); //Should display code
                     res.send("(Button 5) Switch OFF");
                   }
              });
            }
        }
    }
}

export = Route;
