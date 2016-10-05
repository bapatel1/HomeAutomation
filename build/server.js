/// <reference path="typings/express/express.d.ts" />
/// <reference path="typings/body-parser/body-parser.d.ts" />
"use strict";
//Let's import express and other necessary middleware
var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
//Let's import your router files
var garageRouter = require("./routes/garage");
var piRouter = require("./routes/pi");
var zapRouter = require("./routes/zap");
var HttpServer = (function () {
    function HttpServer() {
        this.app = express();
        //configure express and logging stuff
        this.ExpressConfiguration();
        //configure routes
        this.GarageRoutes();
        this.PiRoutes();
    }
    HttpServer.bootstrap = function () {
        return new HttpServer();
    };
    HttpServer.prototype.ExpressConfiguration = function () {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        // catch 404 and forward to error handler
        this.app.use(function (err, req, res, next) {
            var error = new Error("Not Found");
            err.status = 404;
            next(err);
        });
    };
    //Garage automation router
    HttpServer.prototype.GarageRoutes = function () {
        this.router = express.Router();
        var garage = new garageRouter.Garage();
        this.router.get("/on", garage.on.bind(garage.on));
        //this.router.get("/sensor", garage.sensor.bind(garage.sensor));
        this.router.get("/takepicture", garage.takepicture.bind(garage.takepicture));
        this.app.use("/api/garage", this.router);
    };
    //Garage automation router
    HttpServer.prototype.ZAPRoutes = function () {
        this.router = express.Router();
        var zap = new zapRouter.Zap();
        this.router.get("/button1", zap.button1.bind(zap.button1));
        this.router.get("/button2", zap.button2.bind(zap.button2));
        this.router.get("/button3", zap.button3.bind(zap.button3));
        this.router.get("/button4", zap.button4.bind(zap.button4));
        this.router.get("/button5", zap.button5.bind(zap.button5));
        this.app.use("/api/zap", this.router);
    };
    HttpServer.prototype.PiRoutes = function () {
        this.router = express.Router();
        var pi = new piRouter.Pi();
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
    };
    return HttpServer;
}());
//Now initialize app based on HttpServer Class,we defined.
var port = process.env.PORT || 3030;
var httpserver = HttpServer.bootstrap();
var app = httpserver.app;
app.set("port", port);
//Now initialize server from App
var server = http.createServer(app);
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
function onError(error) {
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
