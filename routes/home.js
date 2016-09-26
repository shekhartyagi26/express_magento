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
    var headers = req.headers.app_id;
    var verify = req.Collection;
    request_.headerVerify(headers, verify, function (headers_, url_, msg) {
        if (type.length > 0) {
            client.hgetall(headers + 'products_' + type, function (err, object) {
                if (object != null && object.type == type) {
                    res.json({status: 1, statuscode: SUCCESS_STATUS, body: object});
                } else {
                    var body = ({type: type});
                    var headers = {APP_ID: config.APP_ID};
                    var url = url_ + '/home/products/';
                    request_.request(body, headers, url, function (req, response, msg) {
                        if (msg == ERROR) {
                            res.json({status: 0, statuscode: ERR_STATUS, error: response});
                        } else if (req.statusCode == ERR_STATUS) {
                            res.json({status: 0, statuscode: req.statusCode, body: response});
                        } else {
                            res.json({status: 1, statuscode: req.statusCode, body: response});
                            client.hmset(headers + 'products_' + type, {
                                'type': type,
                                "data": response
                            });
                            client.expire('products_' + type, config.PRODUCT_EXPIRESAT);
                        }
                    });
                }
            });
        } else {
            res.json({status: 0, error: ERR_STATUS, body: INVALID});
        }
    });
});

router.post('/categories', function (req, res) {
    var verify = req.Collection;
    var headers = req.headers.app_id;
    request_.headerVerify(headers, verify, function (headers_, url_, msg) {
        client.hgetall(headers + 'categories', function (err, object) {
            if (object != null && object == object) {
                res.json({status: 1, statuscode: SUCCESS_STATUS, body: object});
            } else {
                var body = ({});
                var headers = {APP_ID: config.APP_ID};
                var url = url_ + '/home/categories/';
                request_.request(body, headers, url, function (req, response, msg) {
                    if (msg == ERROR) {
                        res.json({status: 0, statuscode: ERR_STATUS, error: response});
                    } else if (req.statusCode == ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else {
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                        client.hmset(headers + 'categories', {
                            "body": response
                        });
                        client.expire('categories', config.PRODUCT_EXPIRESAT);
                    }
                });
            }
        });
    });
});

router.post('/slider', function (req, res) {
    var verify = req.Collection;
    var headers = req.headers.app_id;
    request_.headerVerify(headers, verify, function (headers_, url_, msg) {
        client.hgetall(headers + 'slider', function (err, object) {
            if (object != null && object == object) {
                res.json({status: 1, statuscode: SUCCESS_STATUS, body: object});
            } else {
                var body = ({});
                var headers = {APP_ID: config.APP_ID};
                var url = url_ + '/home/slider/';
                request_.request(body, headers, url, function (req, response, msg) {
                    if (msg == ERROR) {
                        res.json({status: 0, statuscode: ERR_STATUS, error: response});
                    } else if (req.statusCode == ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, msg: msg});
                    } else {
                        client.hmset(headers + 'slider', {
                            "body": response
                        });
                        client.expire('categories', config.PRODUCT_EXPIRESAT);
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                    }
                });
            }
        });
    });
});

module.exports = router;