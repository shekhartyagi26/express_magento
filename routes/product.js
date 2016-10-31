var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');
imports('config/constant');
var redis = require("redis"),
        client = redis.createClient();
const request_ = require('../service/request');
router.post('/get', function (req, res) {
    var sku = req.body.sku;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    if (sku == UNDEFINE && APP_ID == UNDEFINE && URL == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else if (sku.length > 0 && APP_ID.length > 0 && URL.length > 0) {
        client.hgetall(headers + 'product_' + sku, function (err, object) {
            if (object != null && object.sku == sku) {
                res.json(object);
            } else {
                var body = ({sku: sku});
                var headers = {APP_ID: APP_ID};
                var url = URL + '/product/get/';
                request_.request(body, headers, url, function (req, response, msg) {
                    if (msg == ERROR) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else if (req.statusCode == ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else {
                        client.hmset(headers + 'product_' + sku, {
                            'sku': sku,
                            "data": response,
                            "status": 1, 
                            "statuscode": req.statusCode
                        });
                        client.expire('product_' + sku, config.PRODUCT_EXPIRESAT);
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                    }
                });
            }
        });
    } else {
        res.json({status: 0, statuscode: ERR_STATUS, body: INVALID});
    }
});

router.post('/review', function (req, res) {
    var sku = req.body.sku;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    var pagesize = req.body.pagesize;
    var pageno = req.body.pageno;
    if (sku.length > 0) {
        client.hgetall('product_' + sku, function (err, object) {
            if (object != null && object.sku == sku) {
                res.json({status: 1, statuscode: SUCCESS_STATUS, body: object});
            } else {
                var body = ({sku: sku, pagesize: pagesize, pageno: pageno});
                var headers = {APP_ID: APP_ID};
                var url = URL + '/product/review/';
                request_.request(body, headers, url, function (req, response, msg) {
                    if (msg == ERROR) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else if (req.statusCode == ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else {
                        client.hmset('product_' + sku, {
                            'sku': sku,
                            "data": response
                        });
                        client.expire('product_' + sku, config.PRODUCT_EXPIRESAT);
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                    }
                });
            }
        });
    } else {
        res.json({status: 0, statuscode: ERR_STATUS, body: INVALID});
    }
});

module.exports = router;