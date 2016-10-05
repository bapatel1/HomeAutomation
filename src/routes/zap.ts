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

var rpi433    = require("rpi-433"),
    rfEmitter = rpi433.emitter({
      pin: 0,                     //Send through GPIO 0 (or Physical PIN 11)
      pulseLength: 350            //Send the code with a 350 pulse length
    });

module Route {
  export class Zap {
    button1 (req: express.Request, res: express.Response, next: express.NextFunction) {
      console.log("Button 1 is pressed.");
      //res.send (req.params);
      if ( req.params.val === 1) {
        res.send ("Switch ON");
      } else {
        res.send ("Switch OFF");
      }
    }

    button2 (req: express.Request, res: express.Response, next: express.NextFunction) {
      console.log("Button 2 is pressed.");
    }

    button3 (req: express.Request, res: express.Response, next: express.NextFunction) {
      console.log("Button 3 is pressed.");
    }

    button4 (req: express.Request, res: express.Response, next: express.NextFunction) {
      console.log("Button 4 is pressed.");
    }

    button5 (req: express.Request, res: express.Response, next: express.NextFunction) {
      console.log("Button 5 is pressed.");
    }
  }
}

export = Route;
