/// <reference path='../typings/tsd.d.ts' />
"use strict";
var Route;
(function (Route) {
    var Users = (function () {
        function Users() {
        }
        Users.prototype.all = function (req, res, next) {
            res.json("{title:'users', message:'All: Users'}");
        };
        Users.prototype.get = function (req, res, next) {
            res.json("{title:'users', message:'GET: Users'}");
        };
        Users.prototype.post = function (req, res, next) {
            res.json("{title:'users', message:'POST: Users'}");
        };
        Users.prototype.put = function (req, res, next) {
            res.json("{title:'users', message:'PUT: Users'}");
        };
        Users.prototype.delete = function (req, res, next) {
            res.json("{title:'users', message:'DELETE: Users'}");
        };
        Users.prototype.patch = function (req, res, next) {
            res.json("{title:'users', message:'PATCH: Users'}");
        };
        Users.prototype.options = function (req, res, next) {
            res.json("{title:'users', message:'OPTIONS: Users'}");
        };
        Users.prototype.head = function (req, res, next) {
            res.json("{title:'users', message:'HEAD: Users'}");
        };
        return Users;
    }());
    Route.Users = Users;
})(Route || (Route = {}));
module.exports = Route;
