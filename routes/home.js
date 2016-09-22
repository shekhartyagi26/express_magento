var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');
var redis = require("redis"),
        client = redis.createClient();
const request_ = require('../service/request');
router.post('/products', function (req, res) {
    var type = req.body.type;
    if (type.length > 0) {
        client.hgetall('products_' + type, function (err, object) {
            if (object != null && object.type == type) {
                console.log({msg: "exist", statuscode: "200", data: object});
                res.json(object);
            } else {
                var body = ({type: type});
                var headers = {APP_ID: config.APP_ID};
                var url = '/home/products/';
                request_.request(body, headers, url, function (req, response, msg) {
                    client.hmset('products_' + type, {
                        'type': type,
                        "data": response
                    });
                    client.expire('products_' + type, config.product_expiresAt);
                    res.json({status: 1, statuscode: req.statusCode, body: response, msg :msg});
                });
            }
        });
    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
    }
});



router.post('/categories', function (req, res) {
    client.hgetall('categories', function (err, object) {
        if (object != null && object == object) {
            console.log({msg: "exist", statuscode: "200", data: object});
            res.json({msg: "exist", statuscode: "200", data: object});
        } else {
            var body = ({});
            var headers = {APP_ID: config.APP_ID};
            var url = '/home/categories/';
            request_.request(body, headers, url, function (req, response) {
                client.hmset('categories', {
                    "body": response
                });
                client.expire('categories', config.product_expiresAt);
                res.json({status: 1, statuscode: req.statusCode, body: response, msg :msg});
            });
        }
    });
});

router.post('/slider', function (req, res) {
    client.hgetall('slider', function (err, object) {
        if (object != null && object == object) {
            console.log({msg: "exist", statuscode: "200", data: object});
            res.json({msg: "exist", statuscode: "200", data: object});
        } else {
            var body = ({});
            var headers = {APP_ID: config.APP_ID};
            var url = '/home/slider/';
            request_.request(body, headers, url, function (req, response) {
                client.hmset('slider', {
                    "body": response
                });
                client.expire('categories', config.product_expiresAt);
                res.json({status: 1, statuscode: req.statusCode, body: response, msg :msg});
            });
        }
    });
});

module.exports = router;