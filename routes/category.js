require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var async = require('async');
var path = require('path');
var request_ = require('../service/request');
var image_ = require('../service/image');
var fs = require('fs');
var redis = require("redis"),
        client = redis.createClient();

router.all('/products', function (req, res) {
    var id = req.body.id;
    var limit = req.body.limit;
    var APP_ID = req.headers.app_id;
    var status = req.status;
    var mobile_width = req.body.mobile_width;
    if (id > 0) {
        client.hgetall('category_' + id, function (err, object) {
            if (object !== null && object.id === id && status === "enabled") {
                res.json(object);
            } else {
                var body = ({id: id, limit: limit});
                API(req, body, '/category/products/', function (req, response, msg) {
                    if (msg === ERROR) {
                        res.json({status: 0, statuscode: ERR_STATUS, error: response});
                    } else if (req.statusCode === ERR_STATUS) {
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
                                    client.hmset('category_' + id, {
                                        'id': id,
                                        "limit": limit,
                                        "body": JSON.stringify(optmized_response)
                                    });
                                    client.expire('category_' + id, config.CATEGORY_EXPIRESAT);
                                    res.json({status: 1, statuscode: req.statusCode, body: JSON.stringify(optmized_response)});
                                }
                            });
                        } else {
                            res.json({status: 0, statuscode: '500', body: ERROR});
                        }
                        function processData(item, key, callback) {
                            var image_url = item.data.small_image;
                            resize(image_url, APP_ID, mobile_width, function (status, response_, image_name) {
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
                    }
                });
            }
        });
    } else {
        res.json({status: 0, statuscode: ERR_STATUS, body: INVALID});
    }
});

router.all('/categorylist', function (req, res) {
    var parent_id = req.body.parent_id;
    var type = req.body.type;
    var store_id = req.body.store_id;
    var status = req.status;
    if (parent_id > 0) {
        client.hgetall('category_' + parent_id, function (err, object) {
            if (object != null && object.parent_id == parent_id && status == "enabled") {
                res.json({status: 1, statuscode: SUCCESS_STATUS, body: object});
            } else {
                var body = ({parent_id: parent_id, type: type, store_id: store_id});
                API(req, body, '/category/categorylist/', function (req, response, msg) {
                    if (msg == ERROR) {
                        res.json({status: 0, statuscode: ERR_STATUS, error: response});
                    } else if (req.statusCode == ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else {
                        client.hmset('category_' + parent_id, {
                            'parent_id': parent_id,
                            "body": response,
                            "type": type
                        });
                        client.expire('category_' + parent_id, config.CATEGORY_EXPIRESAT);
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                    }
                });
            }
        });
    } else {
        res.json({status: 0, error: ERR_STATUS, body: INVALID});
    }
});

module.exports = router;