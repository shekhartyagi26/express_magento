var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var async = require('async');
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
                        var categoryData = resp.data;
                        if (categoryData !== undefined) {
                            var optmized_response = [];
                            async.eachOfLimit(categoryData, 5, processData, function (err) {
                                if (err) {
                                    res.json({status: 0, msg: "OOPS! How is this possible?"});
                                } else {
                                    client.hmset('products_' + type, {
                                        'type': type,
                                        'body': response
                                    });
                                    client.expire('products_' + type, config.PRODUCT_EXPIRESAT);
                                    res.json({status: 1, statuscode: req.statusCode, body: JSON.stringify(optmized_response)});
                                }
                            });
                        } else {
                            res.json({status: 0, statuscode: '500', body: ERROR});
                        }

                        function processData(item, key, callback) {
                            var image_url = item.data.small_image;
                            request_.resize(image_url, APP_ID, function (status, response_, image_name) {
                                image_url = image_name;
                                item.data.small_image = image_url;
                                optmized_response[key] = item;
                                callback(null);
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
                    var resp = JSON.parse(response);
                    var categoryData = resp.data.url;
                    if (categoryData !== undefined) {
                        var optmized_response = [];
                        async.eachOfLimit(categoryData, 5, processData, function (err) {
                            if (err) {
                                res.json({status: 0, msg: "OOPS! How is this possible?"});
                            } else {
                                client.hmset('slider', {
                                    "body": response,
                                    "status": 1,
                                    "statuscode": req.statusCode
                                });
                                client.expire('categories', config.PRODUCT_EXPIRESAT);
                                res.json({status: 1, statuscode: req.statusCode, body: JSON.stringify(optmized_response)});
                            }
                        });
                    } else {
                        res.json({status: 0, statuscode: '500', body: ERROR});
                    }

                    function processData(item, key, callback) {
                        var image_url = item;
                        request_.resize(image_url, APP_ID, function (status, response_, image_name) {
                            image_url = image_name;
                            item = image_url;
                            optmized_response[key] = item;
                            callback(null);
                        });
                    }
                }
            });
        }
    });
});

module.exports = router;