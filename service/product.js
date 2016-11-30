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

productGet = function (req, res) {
    var APP_ID = req.headers.app_id;
    validate(req, res, {sku: 'required',
        secret: 'optional',
        mobile_width: 'required'}, null, function (body) {
        redisFetch(req, res, 'product_', body.parent_id, null, function () {
            API(req, res, body, '/product/get/', function (status, response, msg) {
                if (response !== undefined) {
                    var optmized_response = {};
                    async.eachOfLimit(response, 1, processData, function (err) {
                        if (err) {
                            oops(res, "OOPS! How is this possible?");
                        } else {
                            redisSet('product_', body.sku, null, JSON.stringify(optmized_response), null, function () {
                                success(res, status, optmized_response);
                            });
                        }
                    });
                } else {
                    oops(res, ERROR);
                }
                function processData(item, key, callback) {
                    var image_url = item.small_image;
                    resize(image_url, APP_ID, body.mobile_width, function (status, response_, image_name) {
                        if (status == "200") {
                            minify(image_name, APP_ID, function (status, response_, minify_image) {
                                item.small_image = image_name;
                                item.minify_image = minify_image;
                                optmized_response[key] = item;
                                callback(null);
                            });
                        } else {
                            item.small_image = image_url;
                            item.minify_image = image_url;
                            optmized_response[key] = item;
                            callback(null);
                        }
                    });
                }
            });
        });
    });
};

productReview = function (req, res) {
    validate(req, res, {sku: 'required',
        secret: 'optional',
        mobile_width: 'required',
        pageno: 'required'}, null, function (body) {
        redisFetch(req, res, 'product_', body.parent_id, null, function () {
            API(req, res, body, '/product/review/', function (status, response, msg) {
                redisSet('product_', body.sku, null, JSON.stringify(response), null, function () {
                    success(res, status, response);
                });
            });
        });
    });
};

productGetRating = function (req, res) {
    validate(req, res, {}, null, function (body) {
        if (req.URL) {
            redisFetch(req, res, 'product_', null, null, function () {
                API(req, res, body, '/product/getrating/', function (status, response, msg) {
                    redisSet('product_', null, null, response, null, function () {
                        success(res, status, response);
                    });
                });
            });
        } else {
            oops(res, INVALID);
        }
    });
};