require('node-import');
require('../service/validate');
require('../service/image');
require('../service/request');
require('../service/cache');
require('../service/responseMsg');
require('../service/category');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var async = require('async');

router.all('/products', function (req, res) {
//    categoryProducts(req, res);
    var APP_ID = req.headers.app_id;
    categoryProducts(req, function (body) {
        if (body.status == 0) {
            oops(res, body.msg);
        } else {
            redisFetch(req, res, 'category_', body.id, null, function () {
                API(req, res, body, '/category/products/', function (status, response, msg) {
                    if (response !== undefined) {
                        var optmized_response = [];
                        async.eachOfLimit(response, 5, processData, function (err) {
                            if (err) {
                                oops(res, "OOPS! How is this possible?");
                            } else {
                                redisSet('category_', body.id, body.limit, JSON.stringify(optmized_response), null, function () {
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
        }
    });
});

router.all('/categorylist', function (req, res) {
    categoryCategoryList(req, res);
});

module.exports = router;