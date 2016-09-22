var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cors = require('cors');
require('node-import');
imports('config/index');
var redis = require("redis"),
        client = redis.createClient();

router.post('/alllist', function (req, res) {
    var access_token = req.headers.authorization;
    var to = req.body.to;
    var from = req.body.from;
    var limit = req.body.limit;
    var secret = req.body.secret;

    if (to == undefined && from == undefined && limit == undefined && secret == undefined && access_token == undefined) {
        console.log("undefined ");
        res.json({status: 0, msg: "undefined "});
    } else if (to.length > 0 && from.length > 0 && limit.length > 0 && secret.length > 0 && access_token.length > 0) {
        request({
            url: config.url + '/order/alllist/', //URL to hit
            method: 'post',
            headers: {APP_ID: config.APP_ID, "Authorization": access_token},
            body: JSON.stringify({
                to: to,
                from: from,
                limit: limit,
                secret: secret
            })

        }, function (error, result, body) {
            if (error) {
                console.log(error);
                res.json({status: 0, error: error});
            } else if (result.statusCode == 500) {
                console.log("not found");
                res.json({status: 0, error: result.statusCode, msg: "not found"});
            } else {
                console.log(result.statusCode, body);
                res.json({status: 1, statuscode: result.statusCode, body: body});
            }
        });
    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
    }
});

router.post('/totalorder', function (req, res) {

    var access_token = req.headers.authorization;
    var secret = req.body.secret;

    if (access_token == undefined) {
        console.log("undefined ");
        res.json({status: 0, msg: "undefined "});
    } else if (access_token.length > 0) {
        request({
            url: config.url + '/order/totalorder/', //URL to hit
            method: 'post',
            headers: {APP_ID: config.APP_ID, "Authorization": access_token},
            body: JSON.stringify({
                secret: secret
            })
        }, function (error, result, body) {
            if (error) {
                console.log(error);
                res.json({status: 0, error: error});
            } else if (result.statusCode == 500) {
                console.log("not found");
                res.json({status: 0, error: result.statusCode, msg: "not found"});
            } else if (result.statusCode == 401) {
                console.log("Unauthorized");
                res.json({status: 0, error: result.statusCode, msg: "Unauthorized", body: body});
            } else {
                console.log(result.statusCode, body);
                res.json({status: 1, statuscode: result.statusCode, body: body});
            }
        });
    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
    }
});

module.exports = router;