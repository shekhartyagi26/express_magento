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
    if (type.length > 0) {
        client.hgetall('products_' + type, function (err, object) {
            if (object != null && object.type == type) {
                console.log({msg: "exist", statuscode: "200", data: object});
                res.json({msg: "exist", statuscode: "200", data: object});

            } else {
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
                        client.hmset('products_' + type, {
                            'type': type,
                            "body": body
                        });
                        console.log(result.statusCode, body);
                        res.json({status: 1, msg: "doesnt exist", statuscode: result.statusCode, body: body});
                        client.expire('products_' + type, config.product_expiresAt);
                    }
                });
            }
        });
    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
    }
});



router.post('/categories', function (req, res) {
    client.hgetall('categories', function (err, object) {
        if (object != null && object == object) {
            console.log({msg: "exist", statuscode: "200", data: object});
            res.json({msg: "exist", statuscode: "200", data: object});

        } else {
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
                    console.log("doesnt exist");
                    client.hmset('categories', {
                        "body": body
                    });
                    console.log(result.statusCode, body);
                    res.json({status: 1, msg: "doesnt exist", statuscode: result.statusCode, body: body});
                    client.expire('categories', config.product_expiresAt);
                }
            });
        }
    });
});


module.exports = router;