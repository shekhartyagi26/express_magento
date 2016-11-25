require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var async = require('async');
var redis = require("redis"),
        client = redis.createClient();
var request_ = require('../service/request');

router.post('/products', function (req, res) {
    var APP_ID = req.headers.app_id;
    var status = req.status;
    isValidate(req, {type: 'required',
        secret: 'optional'}, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            client.hgetall('products_' + body.type, function (err, object) {
                if (object != null && object.type == body.type && status == "enabled") {
                    res.json(object);
                } else {
                    API(req, body, '/home/products/', function (req, response, msg) {
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
                                        client.hmset('products_' + body.type, {
                                            'type': body.type,
                                            'body': response
                                        });
                                        client.expire('products_' + body.type, config.PRODUCT_EXPIRESAT);
                                        res.json({status: 1, statuscode: req.statusCode, body: JSON.stringify(optmized_response)});
                                    }
                                });
                            } else {
                                res.json({status: 0, statuscode: '500', body: ERROR});
                            }
                            function processData(item, key, callback) {
                                var image_url = item.data.small_image;
                                request_.resize(image_url, APP_ID, function (status, response_, image_name) {
                                    if (status == '200') {
                                        request_.minify(image_name, APP_ID, function (status, response_, image_name) {
                                            image_url = image_name;
                                            item.data.small_image = image_url;
                                            optmized_response[key] = item;
                                            callback(null);
                                        });
                                    } else {
                                        item.data.small_image = image_url;
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

router.post('/categories', function (req, res) {
    var status = req.status;
    isValidate(req, {}, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            client.hgetall('categories', function (err, object) {
                if (object != null && object == object && status == "enabled") {
                    res.json(object);
                } else {
                    var body = {};
                    API(req, body, '/home/categories/', function (req, response, msg) {
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
        }
    });
});

router.post('/slider', function (req, res) {
    var APP_ID = req.headers.app_id;
    var status = req.status;
    isValidate(req, {}, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            client.hgetall('slider', function (err, object) {
                if (err) {
                    res.json({status: 0, error: err});
                } else {
                    if (object != null && object == object && status == "enabled") {
                        res.json(object);
                    } else {
                        API(req, body, '/home/slider/', function (req, response, msg) {
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
                            }
                        });
                    }
                }
            });
        }
    });
});

module.exports = router;