require('node-import');
require('../service/validate');
require('../service/request');
require('../service/cache');
require('../service/responseMsg');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var async = require('async');
var path = require('path');
var redis = require("redis"),
        client = redis.createClient();
var request_ = require('../service/request');
var image_ = require('../service/image');

router.post('/products', function (req, res) {
    var APP_ID = req.headers.app_id;
    validate(req, res, {
        type: 'required',
        secret: 'optional',
        mobile_width: 'required'
    }, null, function (body) {
        redisFetch(req, res, 'products_', null, body.type, function () {
            API(req, res, body, '/home/products/', function (status, response, msg) {
                var resp = JSON.parse(response);
                var categoryData = resp.data;
                if (categoryData !== undefined) {
                    var optmized_response = [];
                    async.eachOfLimit(categoryData, 5, processData, function (err) {
                        if (err) {
                            res.json({
                                status: 0,
                                msg: "OOPS! How is this possible?"
                            });
                        } else {
                            redisSet('products_', null, null, response, body.type, function () {
                                //                                res.json({status: status, statuscode: msg, body: JSON.stringify(optmized_response)});
                                res.json({status: status, statuscode: msg, body: optmized_response});
                            });
                        }
                    });
                } else {
                    res.json({status: 0, statuscode: '500', body: ERROR});
                }

                function processData(item, key, callback) {
                    var image_url = item.data.small_image;
                    request_.resize(image_url, APP_ID, body.mobile_width, function (status, response_, image_name) {
                        if (status == '200') {
                            minify(image_name, APP_ID, function (status, response_, minify_image) {
                                item.data.small_image = image_name;
                                item.data.minify_image = minify_image;
                                optmized_response[key] = item;
                                callback(null);
                            })
                        } else {
                            item.data.small_image = image_url;
                            item.data.minify_image = image_url;
                            optmized_response[key] = item;
                            callback(null);
                        }
                    });
                }
            });
        });
    });
});

router.post('/categories', function (req, res) {
    validate(req, res, {}, null, function (body) {
        redisFetch(req, res, 'categories', null, null, function () {
            API(req, res, body, '/home/categories/', function (status, response, msg) {
                redisSet('categories', null, null, response, null, function () {
                    res.json({status: status, statuscode: msg, body: JSON.parse(response)});
                });
            });
        });
    });
});

router.post('/slider', function (req, res) {
    var APP_ID = req.headers.app_id;
    validate(req, res, {
        mobile_width: 'required'
    }, null, function (body) {
        redisFetch(req, res, 'slider', null, null, function () {
            API(req, res, body, '/home/slider/', function (status, response, msg) {
                var resp = JSON.parse(response);
                var categoryData = resp.data.url;
                if (categoryData !== undefined) {
                    var optmized_response = [];
                    async.eachOfLimit(categoryData, 5, processData, function (err) {
                        if (err) {
                            res.json({
                                status: 0,
                                msg: "OOPS! How is this possible?"
                            });
                        } else {
                            client.hmset('slider', {
                                "body": response,
                                "status": 1,
                                "statuscode": msg
                            });
                            client.expire('categories', config.PRODUCT_EXPIRESAT);
                            //                            res.json({status: status, statuscode: msg, body: JSON.stringify(optmized_response)});
                            res.json({
                                status: status,
                                statuscode: msg,
                                body: optmized_response
                            });
                        }
                    });
                } else {
                    res.json({status: 0, statuscode: '500', body: ERROR});
                }

                function processData(item, key, callback) {
                    var image_url = item;
                    request_.resize(image_url, APP_ID, body.mobile_width, function (status, response_, image_name) {
                        if (status == '200') {
                            request_.minify(image_name, APP_ID, function (status, response_, image_name) {
                                image_url = image_name;
                                item = image_url;
                                optmized_response[key] = item;
                                callback(null);
                            });
                        } else {
                            item = image_url;
                            optmized_response[key] = item;
                            callback(null);
                        }
                    });
                }
            });
        });
    });
});

module.exports = router;