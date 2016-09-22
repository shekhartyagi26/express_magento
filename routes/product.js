var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');
var redis = require("redis"),
        client = redis.createClient();
const request_ = require('./request');

router.post('/get', function (req, res) {
    var sku = req.body.sku;
    if (sku.length > 0) {
        client.hgetall('product_' + sku, function (err, object) {
            if (object != null && object.sku == sku) {
                console.log(object);
                res.json(object);
            } else {
                var body = ({sku: sku});
                var headers = {APP_ID: config.APP_ID};
                var url = '/product/get/';
                request_.request(body, headers, url, function (req, response) {
                    client.hmset('product_' + sku, {
                        'sku': sku,
                        "data": response
                    });
                    client.expire('product_' + sku, config.product_expiresAt);
                    res.json({status: 1, statuscode: req.statusCode, body: response});
                });
            }
        });
    } else {
        res.json({status: 0, statuscode: "500", msg: "Invalid Fields"});
    }
});


module.exports = router;