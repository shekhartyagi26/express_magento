var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');
var redis = require("redis"),
        client = redis.createClient();


router.post('/products', function (req, res) {

    var type = req.body.type;
    console.log(type);

    if (type.length > 0) {
        request({
            url: config.url + '/home/products/', //URL to hit
            method: 'post',
            headers: {APP_ID: config.APP_ID},
            body: JSON.stringify({
                type: type
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


router.post('/categories', function (req, res) {

    request({
        url: config.url + '/home/categories/', //URL to hit
        method: 'post',
        headers: {APP_ID: config.APP_ID},
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

});


module.exports = router;