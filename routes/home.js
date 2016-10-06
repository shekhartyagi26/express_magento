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
    if (type == UNDEFINE && APP_ID == UNDEFINE && URL == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else if (type.length > 0 && APP_ID.length > 0 && URL.length > 0) {
        client.hgetall(headers + 'products_' + type, function (err, object) {
            if (object != null && object.type == type) {
                res.json({status: 1, statuscode: SUCCESS_STATUS, body: object});
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

router.post('/categories', function (req, res) {
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    if (APP_ID == UNDEFINE && URL == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else if (APP_ID.length > 0 && URL.length > 0) {
        client.hgetall(headers + 'categories', function (err, object) {
            if (object != null && object == object) {
                res.json({status: 1, statuscode: SUCCESS_STATUS, body: object});
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
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                        client.hmset(headers + 'categories', {
                            "body": response
                        });
                        client.expire('categories', config.PRODUCT_EXPIRESAT);
                    }
                });
            }
        });
    } else {
        res.json({status: 0, statuscode: ERR_STATUS, msg: INVALID});
    }
});

router.post('/slider', function (req, res) {
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    if (APP_ID == UNDEFINE && URL == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else if (APP_ID.length > 0 && URL.length > 0) {
        client.hgetall(headers + 'slider', function (err, object) {
            if (object != null && object == object) {
                res.json({status: 1, statuscode: SUCCESS_STATUS, body: object});
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
                        client.hmset(headers + 'slider', {
                            "body": response
                        });
                        client.expire('categories', config.PRODUCT_EXPIRESAT);
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                    }
                });
            }
        });
    } else {
        res.json({status: 0, statuscode: ERR_STATUS, msg: INVALID});
    }
});

module.exports = router;