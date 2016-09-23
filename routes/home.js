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
    if (type.length > 0) {
        client.hgetall('products_' + type, function (err, object) {
            if (object != null && object.type == type) {
                res.json({status: 1, statuscode: Status.SUCCESS_STATUS, body: object});
            } else {
                var body = ({type: type});
                var headers = {APP_ID: config.APP_ID};
                var url = '/home/products/';
                request_.request(body, headers, url, function (req, response, msg) {
                    if (msg == Status.ERROR) {
                        res.json({status: 0, statuscode: Status.ERR_STATUS, error: response});
                    } else if (req.statusCode == Status.ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else {
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                        client.hmset('products_' + type, {
                            'type': type,
                            "data": response
                        });
                        client.expire('products_' + type, config.PRODUCT_EXPIRESAT);
                    }
                });
            }
        });
    } else {
        res.json({status: 0, error: Status.ERR_STATUS, body: Status.INVALID});
    }
});

router.post('/categories', function (req, res) {
    client.hgetall('categories', function (err, object) {
        if (object != null && object == object) {
            res.json({status: 1, statuscode: Status.SUCCESS_STATUS, body: object});
        } else {
            var body = ({});
            var headers = {APP_ID: config.APP_ID};
            var url = '/home/categories/';
            request_.request(body, headers, url, function (req, response, msg) {
                if (msg == Status.err) {
                    res.json({status: 0, statuscode: Status.ERR_STATUS, error: response});
                } else if (req.statusCode == Status.ERR_STATUS) {
                    res.json({status: 0, statuscode: req.statusCode, body: response});
                } else {
                    res.json({status: 1, statuscode: req.statusCode, body: response});
                    client.hmset('categories', {
                        "body": response
                    });
                    client.expire('categories', config.PRODUCT_EXPIRESAT);
                }
            });
        }
    });
});

router.post('/slider', function (req, res) {
    client.hgetall('slider', function (err, object) {
        if (object != null && object == object) {
            res.json({status: 1, statuscode: Status.SUCCESS_STATUS, body: object});
        } else {
            var body = ({});
            var headers = {APP_ID: config.APP_ID};
            var url = '/home/slider/';
            request_.request(body, headers, url, function (req, response, msg) {
                if (msg == Status.err) {
                    res.json({status: 0, statuscode: Status.ERR_STATUS, error: response});
                } else if (req.statusCode == Status.ERR_STATUS) {
                    res.json({status: 0, statuscode: req.statusCode, msg: msg});
                } else {
                    client.hmset('slider', {
                        "body": response
                    });
                    client.expire('categories', config.PRODUCT_EXPIRESAT);
                    res.json({status: 1, statuscode: req.statusCode, body: response});
                }
            });
        }
    });
});

module.exports = router;