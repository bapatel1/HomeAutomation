/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/body-parser/body-parser.d.ts" />
/// <reference path="typings/modules/mongoose/index.d.ts" />
"use strict";
//Let's import express and other necessary middleware
import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as http from "http";
import * as mongoose from "mongoose";
mongoose.connect("mongodb://homeautomationuser:NhbM3CTk9KCf@ds061076.mlab.com:61076/homeautomation", ["settings", "doorsensors", "zapsensors"]);

//Let's import your router files
import * as garageRouter from "./routes/garage";
import * as maindoorRouter from "./routes/maindoor";
import * as backdoorRouter from "./routes/backdoor";
import * as kitchendoorRouter from "./routes/kitchendoor";
import * as piRouter from "./routes/pi";
import * as zapRouter from "./routes/zap";

class HttpServer {
    public app: express.Application;
    public router: express.Router;

    public static bootstrap(): HttpServer {
        return new HttpServer();
    }
    constructor() {
        this.app = express();

        //configure express and logging stuff
        this.ExpressConfiguration();

        //configure routes
        this.GarageRoutes();
        this.ZAPRoutes();
        this.PiRoutes();
        this.MainDoorRoutes();
        this.BackDoorRoutes();
        this.KitchenDoorRoutes();
    }
    private ExpressConfiguration() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        // catch 404 and forward to error handler
        this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            var error = new Error("Not Found");
            err.status = 404;
            next(err);
        });
    }

    //MainDoor router
    private MainDoorRoutes() {
        this.router = express.Router();
        var main: maindoorRouter.MainDoor = new maindoorRouter.MainDoor();
        this.app.use("/api/door/main", this.router);
    }

    //BackDoor router
    private BackDoorRoutes() {
        this.router = express.Router();
        var back: backdoorRouter.BackDoor = new backdoorRouter.BackDoor();
        this.app.use("/api/door/back", this.router);
    }


    //KitchenDoor router
    private KitchenDoorRoutes() {
        this.router = express.Router();
        var kitchen: kitchendoorRouter.KitchenDoor = new kitchendoorRouter.KitchenDoor();
        this.app.use("/api/door/kitchen", this.router);
    }
    //Garage automation router
    private GarageRoutes() {
        this.router = express.Router();
        var garage: garageRouter.Garage = new garageRouter.Garage();
        this.router.get("/on", garage.on.bind(garage.on));
        //this.router.get("/sensor", garage.sensor.bind(garage.sensor));
        this.router.get("/takepicture", garage.takepicture.bind(garage.takepicture));
        this.app.use("/api/garage", this.router);
    }

    //Garage automation router
    private ZAPRoutes() {
        this.router = express.Router();
        var zap: zapRouter.Zap = new zapRouter.Zap();
        this.router.get("/button1/:val", zap.button1.bind(zap.button1));
        this.router.get("/button2/:val", zap.button2.bind(zap.button2));
        this.router.get("/button3/:val", zap.button3.bind(zap.button3));
        this.router.get("/button4/:val", zap.button4.bind(zap.button4));
        this.router.get("/button5/:val", zap.button5.bind(zap.button5));
        this.router.get("/sniffer", zap.sniffer.bind(zap.sniffer));
        this.app.use("/api/zap", this.router);
    }

    private PiRoutes() {
        this.router = express.Router();
        var pi: piRouter.Pi = new piRouter.Pi();
        this.router.get("/cpu", pi.cpu.bind(pi.cpu));
        this.router.get("/cputemp", pi.cputemp.bind(pi.cputemp));
        this.router.get("/networkinfo", pi.networkinfo.bind(pi.networkinfo));
        this.router.get("/linuxversion", pi.linuxversion.bind(pi.linuxversion));
        this.router.get("/memory", pi.memory.bind(pi.memory));
        this.router.get("/system", pi.systeminfo.bind(pi.systeminfo));
        this.router.get("/time", pi.time.bind(pi.time));
        this.router.get("/restart", pi.restart.bind(pi.restart));
        this.router.get("/shutdown", pi.shutdown.bind(pi.shutdown));
        this.app.use("/api/pi", this.router);
    }

}

//Now initialize app based on HttpServer Class,we defined.
const port: number = process.env.PORT || 3030;
let httpserver = HttpServer.bootstrap();
let app = httpserver.app;
app.set("port", port);

//Now initialize server from App
const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);



// ********************************************************
// DONOT TOUCH FOLLOWING FUNCTIONS. THEY ARE HERE FOR HELP
// ********************************************************
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    console.log("Listening on " + bind);
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
