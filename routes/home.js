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

router.post('/products', function (req, res) {
    var type = req.body.type;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    var status = req.status;
    if (type.length > 0) {
        client.hgetall('products_' + type, function (err, object) {
            if (object != null && object.type == type && status == "enabled") {
                res.json(object);
            } else {
                var body = ({type: type});
                var headers = {APP_ID: APP_ID};
                var url = URL + '/home/products/';
                request_.request(body, headers, url, function (req, response, msg) {
                    if (msg == ERROR) {
                        res.json({status: 0, statuscode: ERR_STATUS, error: response});
                    } else if (req.statusCode == ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else {
                        var resp = JSON.parse(response);
                        for (i = 0; i < resp.data[0].data.media_images.length; i++) {
                            var url = resp.data[0].data.media_images[i];
                            request_.resize(url, APP_ID, function (status, response_, image_name) {
                                if (status == '200') {
                                    client.hmset('products_' + type, {
                                        'type': type,
                                        'body': response
                                    });
                                    client.expire('products_' + type, config.PRODUCT_EXPIRESAT);
                                    res.json({status: 1, statuscode: req.statusCode, body: response});
                                } else {
                                    res.json({status: 0, statuscode: status, body: response_});
                                }
                            });
                        }
                    }
                });
            }
        });
    } else {
        res.json({status: 0, error: ERR_STATUS, body: INVALID});
    }
});

router.post('/categories', function (req, res) {
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    var status = req.status;
    client.hgetall('categories', function (err, object) {
        if (object != null && object == object && status == "enabled") {
            res.json(object);
        } else {
            var body = ({});
            var headers = {APP_ID: APP_ID};
            var url = URL + '/home/categories/';
            request_.request(body, headers, url, function (req, response, msg) {
                if (msg == ERROR) {
                    res.json({status: 0, statuscode: ERR_STATUS, error: response});
                } else if (req.statusCode == ERR_STATUS) {
                    res.json({status: 0, statuscode: req.statusCode, body: response});
                } else {
                    client.hmset('categories', {
                        "body": response
                    });
                    client.expire('categories', config.PRODUCT_EXPIRESAT);
                    res.json({status: 1, statuscode: req.statusCode, body: response});
                }
            });
        }
    });
});

router.post('/slider', function (req, res) {
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    var status = req.status;
    client.hgetall('slider', function (err, object) {
        if (object != null && object == object && status == "enabled") {
            res.json(object);
        } else {
            var body = ({});
            var headers = {APP_ID: APP_ID};
            var url = URL + '/home/slider/';
            request_.request(body, headers, url, function (req, response, msg) {
                if (msg == ERROR) {
                    res.json({status: 0, statuscode: ERR_STATUS, error: response});
                } else if (req.statusCode == ERR_STATUS) {
                    res.json({status: 0, statuscode: req.statusCode, msg: msg});
                } else {
                    client.hmset('slider', {
                        "body": response,
                        "status": 1,
                        "statuscode": req.statusCode
                    });
                    client.expire('categories', config.PRODUCT_EXPIRESAT);
                    res.json({status: 1, statuscode: req.statusCode, body: response});
                }
            });
        }
    });
});

module.exports = router;