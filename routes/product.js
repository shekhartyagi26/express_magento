require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var async = require('async');
var redis = require("redis"),
        client = redis.createClient();
var request_ = require('../service/request');
var image_ = require('../service/image');

router.post('/get', function (req, res) {
    var APP_ID = req.headers.app_id;
    var status = req.status;
    validate(req, res, {sku: 'required',
        secret: 'optional',
        mobile_width: 'required'}, null, function (body) {
        client.hgetall('product_' + body.sku, function (err, object) {
            if (object != null && object.sku == body.sku && status == 'enabled') {
                res.json(object);
            } else {
                API(req, body, '/product/get/', function (status, response, msg) {
                    if (status == 0) {
                        res.json({status: status, statuscode: msg, body: response});
                    } else {
                        var resp = JSON.parse(response);
                        var categoryData = resp.data;
                        if (categoryData !== undefined) {
                            var optmized_response = {};
                            async.eachOfLimit(categoryData, 1, processData, function (err) {
                                var s = [];
                                if (err) {
                                    res.json({status: 0, msg: "OOPS! How is this possible?"});
                                } else {
                                    client.hmset('product_' + body.sku, {
                                        'sku': body.sku,
                                        'body': JSON.stringify(optmized_response)
                                    });
                                    client.expire('product_' + body.sku, config.PRODUCT_EXPIRESAT);
                                   if(optmized_response){
                                       res.json({status: status, statuscode: msg, body: optmized_response});
                                   }else{
                                        res.json({status:11});
                                    }
                                }
                            });
                        } else {
                            res.json({status: 0, statuscode: '500', body: ERROR});
                        }
                        function processData(item, key, callback) {
                            var image_url = item.small_image;
                            resize(image_url, APP_ID, body.mobile_width, function (status, response_, image_name) {
                                if (status == "200") {
                                    minify(image_name, APP_ID, function (status, response_, image_name) {
                                        item.small_image = image_name;
                                        item.minify_image = minify_image;
                                        optmized_response[key] = item;
                                        callback(null);
                                    });
                                } else {
                                    item.small_image = image_url;
                                    item.minify_image = minify_image;
                                    optmized_response[key] = item;
                                    callback(null);
                                }
                            });
                        }
                    }
                });
            }
        });
    });
});

router.post('/review', function (req, res) {
    var status = req.status;
    validate(req, res, {sku: 'required',
        secret: 'optional',
        pagesize: 'required',
        pageno: 'required'}, null, function (body) {
        client.hgetall('product_' + body.sku, function (err, object) {
            if (object != null && object.sku == body.sku && status == 'enabled') {
                res.json({status: 1, statuscode: SUCCESS_STATUS, body: object});
            } else {
                API(req, body, '/product/review/', function (status, response, msg) {
                    if (status == 0) {
                        res.json({status: status, statuscode: msg, body: response});
                    } else {
                        client.hmset('product_' + body.sku, {
                            'sku': body.sku,
                            "body": response
                        });
                        client.expire('product_' + body.sku, config.PRODUCT_EXPIRESAT);
                        res.json({status: status, statuscode: msg, body: response});
                    }
                });
            }
        });
    });
});

router.post('/getrating', function (req, res) {
    var status = req.status;
    validate(req, res, {}, null, function (body) {
        if (req.URL) {
            client.hgetall('product_', function (err, object) {
                if (object != null && status == 'enabled') {
                    res.json(object);
                } else {
                    API(req, body, '/product/getrating/', function (status, response, msg) {
                        if (status == 0) {
                            res.json({status: status, statuscode: msg, body: response});
                        } else {
                            client.hmset('product_', {
                                "body": response
                            });
                            client.expire('product_', config.PRODUCT_EXPIRESAT);
                            res.json({status: status, statuscode: msg, body: response});
                        }
                    });
                }
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
            API(req, body, '/product/submitreview/', function (status, response, msg) {
                res.json({status: status, statuscode: msg, body: response});
            });
        } else {
            res.json({status: 0, statuscode: ERR_STATUS, body: INVALID});
        }
    });
});

module.exports = router;