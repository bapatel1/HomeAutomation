/// <reference path='../typings/tsd.d.ts' />

"use strict";
import * as express from "express";
import * as events from "events";
import * as stream from "stream";
const exec = require("child_process").exec;
const si = require("systeminformation");


module Route {
    export class Pi {

        cpu(req: express.Request, res: express.Response, next: express.NextFunction) {
            // promises style - new in version 3
            si.cpu()
                .then((data: any) => res.json(data))
                .catch((error: any) => { console.error(error); res.json(error); });

        }

        time(req: express.Request, res: express.Response, next: express.NextFunction) {
            si.time()
                .then((data: any) => res.json(data))
                .catch((error: any) => { console.error(error); res.json(error); });
        }

        cputemp(req: express.Request, res: express.Response, next: express.NextFunction) {
            si.cpuTemperature()
                .then((data: any) => res.json(data))
                .catch((error: any) => { console.error(error); res.json(error); });
        }

        linuxversion(req: express.Request, res: express.Response, next: express.NextFunction) {
          si.osInfo()
              .then((data: any) => res.json(data))
              .catch((error: any) => { console.error(error); res.json(error); });
        }

        memory(req: express.Request, res: express.Response, next: express.NextFunction) {
            si.mem()
                .then((data: any) => res.json(data))
                .catch((error: any) => { console.error(error); res.json(error); });
        }

        networkinfo(req: express.Request, res: express.Response, next: express.NextFunction) {
            si.networkInterfaces()
                .then((data: any) => res.json(data))
                .catch((error: any) => { console.error(error); res.json(error); });
        }

        systeminfo(req: express.Request, res: express.Response, next: express.NextFunction) {
            si.system()
                .then((data: any) => res.json(data))
                .catch((error: any) => { console.error(error); res.json(error); });
        }

        restart(req: express.Request, res: express.Response, next: express.NextFunction) {
            //res.json("{title:'index', message:'OFF: Index'}");
            let child = exec("sudo shutdown -r now", function(error: Error, stdout: Buffer, stderr: Buffer) {
                if (error) {
                  console.log(error);
                }
                res.json(stdout);
                process.stderr.write(stderr);
            });
        }


        shutdown(req: express.Request, res: express.Response, next: express.NextFunction) {
            //res.json("{title:'index', message:'OFF: Index'}");
            let child = exec("sudo shutdown -h now", function(error: Error, stdout: Buffer, stderr: Buffer) {
                if (error) {
                  console.log(error);
                }
                res.json(stdout);
                process.stderr.write(stderr);
            });
        }
    }
}
export = Route;
