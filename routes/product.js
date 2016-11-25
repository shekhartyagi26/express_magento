require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var async = require('async');
var redis = require("redis"),
        client = redis.createClient();
var request_ = require('../service/request');

router.post('/get', function (req, res) {
    var APP_ID = req.headers.app_id;
    var status = req.status;
    isValidate(req, {sku: 'required',
        secret: 'optional'}, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            client.hgetall('product_' + body.sku, function (err, object) {
                if (object != null && object.sku == body.sku && status == 'enabled') {
                    res.json(object);
                } else {
                    API(req, body, '/product/get/', function (req, response, msg) {
                        if (msg == ERROR) {
                            res.json({status: 0, statuscode: req.statusCode, body: response});
                        } else if (req.statusCode == ERR_STATUS) {
                            res.json({status: 0, statuscode: req.statusCode, body: response});
                        } else {
                            var resp = JSON.parse(response);
                            var categoryData = resp.data;
                            if (categoryData !== undefined) {
                                var optmized_response = [];
                                async.eachOfLimit(categoryData, 1, processData, function (err) {
                                    if (err) {
                                        res.json({status: 0, msg: "OOPS! How is this possible?"});
                                    } else {
                                        client.hmset('product_' + body.sku, {
                                            'sku': body.sku,
                                            "body": JSON.stringify(optmized_response)
                                        });
                                        client.expire('product_' + body.sku, config.PRODUCT_EXPIRESAT);
                                        res.json({status: 1, statuscode: req.statusCode, body: JSON.stringify(optmized_response)});
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
                        }
                    });
                }
            });
        }
    });
});

router.post('/review', function (req, res) {
    var status = req.status;
    isValidate(req, {sku: 'required',
        secret: 'optional',
        pagesize: 'required',
        pageno: 'required'}, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            client.hgetall('product_' + body.sku, function (err, object) {
                if (object != null && object.sku == body.sku && status == 'enabled') {
                    res.json({status: 1, statuscode: SUCCESS_STATUS, body: object});
                } else {
                    var body = ({sku: sku, pagesize: pagesize, pageno: pageno});
                    API(req, body, '/product/review/', function (req, response, msg) {
                        if (msg == ERROR) {
                            res.json({status: 0, statuscode: req.statusCode, body: response});
                        } else if (req.statusCode == ERR_STATUS) {
                            res.json({status: 0, statuscode: req.statusCode, body: response});
                        } else {
                            client.hmset('product_' + body.sku, {
                                'sku': body.sku,
                                "body": response
                            });
                            client.expire('product_' + body.sku, config.PRODUCT_EXPIRESAT);
                            res.json({status: 1, statuscode: req.statusCode, body: response});
                        }
                    });
                }
            });
        }
    });
});

router.post('/getrating', function (req, res) {
    var status = req.status;
    isValidate(req, {}, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            if (req.URL.length > 0) {
                client.hgetall('product_', function (err, object) {
                    if (object != null && status == 'enabled') {
                        res.json(object);
                    } else {
                        API(req, body, '/product/getrating/', function (req, response, msg) {
                            if (msg == ERROR) {
                                res.json({status: 0, statuscode: req.statusCode, body: response});
                            } else if (req.statusCode == ERR_STATUS) {
                                res.json({status: 0, statuscode: req.statusCode, body: response});
                            } else {
                                client.hmset('product_', {
                                    "body": response
                                });
                                client.expire('product_', config.PRODUCT_EXPIRESAT);
                                res.json({status: 1, statuscode: req.statusCode, body: response});
                            }
                        });
                    }
                });
            } else {
                res.json({status: 0, statuscode: ERR_STATUS, body: INVALID});
            }
        }
    });
});

router.post('/submitreview', function (req, res) {
    isValidate(req, {sku: 'required',
        store_id: 'required',
        title: 'required',
        details: 'required',
        nickname: 'required',
        rating_options: 'required',
        secret: 'optional'}, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            if (req.headers.app_id.length > 0 && req.URL.length > 0) {
                API(req, body, '/product/submitreview/', function (req, response, msg) {
                    if (msg == ERROR) {
                        res.json({status: 0, statuscode: ERR_STATUS, error: response});
                    } else if (req.statusCode == ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else {
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                    }
                });
            } else {
                res.json({status: 0, statuscode: ERR_STATUS, body: INVALID});
            }
        }
    });
});

module.exports = router;