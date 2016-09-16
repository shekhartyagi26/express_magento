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

    var to = req.body.to;
    var from = req.body.from;
    if (to == undefined && from == undefined) {
        console.log("undefined ");
        res.json({status: 0, msg: "undefined "});
    } else if (to.length > 0 && from.length > 0) {
        request({
            url: config.url + '/order/alllist/', //URL to hit
            method: 'post',
            headers: {APP_ID: config.APP_ID},
            body: JSON.stringify({
                to: to,
                from: from
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
module.exports = router;