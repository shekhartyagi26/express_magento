var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cors = require('cors');
require('node-import');
imports('config/index');
var redis = require("redis"),
        client = redis.createClient();

router.all('/cart', function (req, res) {
    var productid = req.body.productid;
    var secret = req.body.secret;
    var access_token = req.headers.authorization;
    if (productid > 0) {
        request({
            url: config.url + '/cart/cart/', //URL to hit
            method: 'post',
            headers: {APP_ID: config.APP_ID, "Authorization": access_token},
            body: JSON.stringify({
                productid: productid,
                secret: secret
            })

        }, function (error, response, body) {
            if (error) {
                console.log(error);
                res.json(error);
            }
            if (response.statusCode == 500) {
                console.log("not found");
                res.json({status: 0, error: response.statusCode, msg: "not found"});
            } else {
                console.log({data: body});
                res.json({statuscode: response.statusCode, body: body});
            }
        });


    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
        console.log("Invalid Fields");
    }
});
module.exports = router;