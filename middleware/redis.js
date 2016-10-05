var express = require('express');
var router = express.Router();
var redis = require("redis"),
        client = redis.createClient();

module.exports = function (req, res, next) {
    var headers = req.headers.app_id;
    var dtabase = req.app;
    var promise = dtabase.findOne({APP_ID: headers}).exec();
    if (headers.length > 0) {
        promise.then(function (redis) {
            header = redis.get('APP_ID');
            if (header == "com.tethr") {
                client.select(1, function (err, res) {
                    client.set('key', 'string'); // this will be posted to database 1 rather than db 0
                    next();
                });
            } else if (headers == 'com.react.tethr') {
                client.select(2, function (err, res) {
                    client.set('key', 'string'); // this will be posted to database 1 rather than db 0
                    next();
                });
            } else {
                client.select(3, function (err, res) {
                    client.set('key', 'string'); // this will be posted to database 1 rather than db 0
                    next();
                });
            }
        })
                .catch(function (err) {
                    console.log(err);
                    res.json({status: 0, statuscode: 500, body: "header is not found in database"});
                });
    } else if (headers == undefined) {
        res.json({status: 0, statuscode: 500, body: "header is undefined"});
    } else {
        res.json({status: 0, statuscode: 500, body: "header cannot be empty"});
    }
}