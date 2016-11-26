require('node-import');
require('../service/validate');
require('../service/request');
require('../service/cache');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var async = require('async');
var request_ = require('../service/request');

router.post('/get', function (req, res) {
    var APP_ID = req.headers.app_id;
    validate(req, res, {sku: 'required',
        secret: 'optional'}, null, function (body) {
        redisFetch(req, res, 'product_', body.parent_id, null, function () {
            API(req, res, body, '/product/get/', function (status, response, msg) {
                var resp = JSON.parse(response);
                var categoryData = resp.data;
                if (categoryData !== undefined) {
                    var optmized_response = [];
                    async.eachOfLimit(categoryData, 1, processData, function (err) {
                        if (err) {
                            res.json({status: 0, msg: "OOPS! How is this possible?"});
                        } else {
                            redisSet('product_', body.sku, null, JSON.stringify(optmized_response), null, function () {
//                                res.json({status: status, statuscode: msg, body: JSON.stringify(optmized_response)});
                                res.json({status: status, statuscode: msg, body: optmized_response});
                            });
                        }
                    });
                } else {
                    res.json({status: 0, statuscode: '500', body: ERROR});
                }
                function processData(item, key, callback) {
                    var image_url = item.small_image;
                    request_.resize(image_url, APP_ID, function (status, response_, image_name) {
                        if (status == "200") {
                            request_.minify(image_name, APP_ID, function (status, response_, image_name) {
                                image_url = image_name;
                                item.small_image = image_url;
                                optmized_response[key] = item;
                                callback(null);
                            });
                        } else {
                            item.small_image = image_url;
                            optmized_response[key] = item;
                            callback(null);
                        }
                    });
                }
            });
        });
    });
});

router.post('/review', function (req, res) {
    validate(req, res, {sku: 'required',
        secret: 'optional',
        pagesize: 'required',
        pageno: 'required'}, null, function (body) {
        redisFetch(req, res, 'product_', body.parent_id, null, function () {
            API(req, res, body, '/product/review/', function (status, response, msg) {
                redisSet('product_', body.sku, null, response, null, function () {
                    res.json({status: status, statuscode: msg, body: JSON.parse(response)});
                });
            });
        });
    });
});

router.post('/getrating', function (req, res) {
    validate(req, res, {}, null, function (body) {
        if (req.URL) {
            redisFetch(req, res, 'product_', null, null, function () {
                API(req, res, body, '/product/getrating/', function (status, response, msg) {
                    redisSet('product_', null, null, response, null, function () {
                        res.json({status: status, statuscode: msg, body: JSON.parse(response)});
                    });
                });
            });
        } else {
            res.json({status: 0, statuscode: ERR_STATUS, body: INVALID});
        }
    });
});

router.post('/submitreview', function (req, res) {
    validate(req, res, {sku: 'required',
        store_id: 'required',
        title: 'required',
        details: 'required',
        nickname: 'required',
        rating_options: 'required',
        secret: 'optional'}, null, function (body) {
        if (req.headers.app_id && req.URL) {
            API(req, res, body, '/product/submitreview/', function (status, response, msg) {
                res.json({status: status, statuscode: msg, body: JSON.parse(response)});
            });
        } else {
            res.json({status: 0, statuscode: ERR_STATUS, body: INVALID});
        }
    });
});

module.exports = router;