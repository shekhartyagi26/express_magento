require('node-import');
require('./validate');
require('./image');
require('./request');
require('./cache');
require('./responseMsg');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var async = require('async');
var redis = require("redis"),
        client = redis.createClient();

homeProducts = function (req, res) {
    var APP_ID = req.headers.app_id;
    validate(req, res, {
        type: 'required',
        secret: 'optional',
        mobile_width: 'required'
    }, null, function (body) {
        redisFetch(req, res, 'products_', null, body.type, function () {
            API(req, res, body, '/home/products/', function (status, response, msg) {
                if (response !== undefined) {
                    var optmized_response = [];
                    async.eachOfLimit(response, 5, processData, function (err) {
                        if (err) {
                            oops(res, "OOPS! How is this possible?");
                        } else {
                            redisSet('products_', null, null, response, body.type, function () {
                                success(res, status, optmized_response);
                            });
                        }
                    });
                } else {
                    oops(res, ERROR);
                }

                function processData(item, key, callback) {
                    var image_url = item.data.small_image;
                    resize(image_url, APP_ID, body.mobile_width, function (status, response_, image_name) {
                        if (status == '200') {
                            minify(image_name, APP_ID, function (status, response_, minify_image) {
                                item.data.small_image = image_name;
                                item.data.minify_image = minify_image;
                                optmized_response[key] = item;
                                callback(null);
                            });
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
};

homeCategories = function (req, res) {
    validate(req, res, {}, null, function (body) {
        redisFetch(req, res, 'categories', null, null, function () {
            API(req, res, body, '/home/categories/', function (status, response, msg) {
                redisSet('categories', null, null, response, null, function () {
                    success(res, status, response);
                });
            });
        });
    });
};

homeSlider = function (req, res) {
    var APP_ID = req.headers.app_id;
    validate(req, res, {
        mobile_width: 'required'
    }, null, function (body) {
        redisFetch(req, res, 'slider', null, null, function () {
            API(req, res, body, '/home/slider/', function (status, response, msg) {
                if (response.url !== undefined) {
                    var optmized_response = [];
                    async.eachOfLimit(response.url, 5, processData, function (err) {
                        if (err) {
                            oops(res, "OOPS! How is this possible?");
                        } else {
                            client.hmset('slider', {
                                "body": JSON.stringify(response),
                                "status": 1,
                                "statuscode": msg
                            });
                            client.expire('categories', config.PRODUCT_EXPIRESAT);
                            success(res, status, optmized_response);
                        }
                    });
                } else {
                    oops(res, 0, ERROR);
                }

                function processData(item, key, callback) {
                    resize(item, APP_ID, body.mobile_width, function (status, response_, image_name) {
                        if (status == '200') {
                            image_url = image_name;
                            item = image_url;
                            optmized_response[key] = item;
                            callback(null);
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
};