var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');
var redis = require("redis"),
        client = redis.createClient();

router.post('/get', function (req, res) {
    var sku = req.body.sku;

    if (sku.length > 0) {
        client.hgetall('product_' + sku, function (err, object) {
            if (object != null && object.sku == sku) {
                console.log(object);
                res.json(object);
            } else {
                request({
                    url: config.url + '/product/get/', //URL to hit
                    method: 'POST',
                    headers: {APP_ID: config.APP_ID},
                    body: JSON.stringify({
                        sku: sku
                    })

                }, function (error, response, body) {
                    if (error) {
                        console.log(error);
                        res.json(error);
                    }
                    if (response.statusCode == 500) {
                        console.log("not found");
                        res.json({status: 0, msg: "not found"});
                    } else {
                        client.hmset('product_' + sku, {
                            'sku': sku,
                            "data": body
                        });
                        console.log({sku: sku, data: body});
                        res, json({sku: sku, data: body});

                        client.expire('product_' + sku, config.product_expiresAt);
                    }
                });
            }
        });
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});


module.exports = router;