var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');
imports('config/constant');
var redis = require("redis"),
        client = redis.createClient();
const request_ = require('../service/request');

router.post('/get', function (req, res) {
    var sku = req.body.sku;
    if (sku.length > 0) {
        client.hgetall('product_' + sku, function (err, object) {
            if (object != null && object.sku == sku) {
                res.json({status: 1, statuscode: Status.SUCCESS_STATUS, body: object});
            } else {
                var body = ({sku: sku});
                var headers = {APP_ID: config.APP_ID};
                var url = '/product/get/';
                request_.request(body, headers, url, function (req, response, msg) {
                    if (msg == Status.ERROR) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else if (req.statusCode == Status.ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else {
                        client.hmset('product_' + sku, {
                            'sku': sku,
                            "data": response
                        });
                        client.expire('product_' + sku, config.PRODUCT_EXPIRESAT);
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                    }
                });
            }
        });
    } else {
        res.json({status: 0, statuscode: Status.ERR_STATUS, body: Status.INVALID});
    }
});


module.exports = router;