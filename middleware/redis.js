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
            HeaderId = redis.get('HeaderId');
            client.select(HeaderId, function (err, res) {
                client.set('key', 'string');
                req.HeaderId = HeaderId;
                next();
            });
        })
                .catch(function (err) {
                    res.json({status: 0, statuscode: 500, body: "header is not found in database"});
                });
    } else if (headers == undefined) {
        res.json({status: 0, statuscode: 500, body: "header is undefined"});
    } else {
        res.json({status: 0, statuscode: 500, body: "header cannot be empty"});
    }
}