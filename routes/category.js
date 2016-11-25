require('node-import');
require('../service/secret');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var async = require('async');
var request_ = require('../service/request');
var redis = require("redis"),
        client = redis.createClient();

router.all('/products', function (req, res) {
    var APP_ID = req.headers.app_id;
    validate(req, res, {countryid: 'optional',
        zip: 'optional',
        city: 'optional',
        telephone: 'optional',
        fax: 'optional',
        company: 'optional',
        street: 'optional',
        firstname: 'optional',
        lastname: 'optional',
        password: 'optional',
        newPassword: 'optional',
        secret: 'optional',
        entity_id: 'optional',
        productid: 'optional',
        store_id: 'optional',
        parent_id: 'optional',
        type: 'optional',
        limit: 'required',
        id: 'required'}, null, function (body) {
        redisFetch(req, res, 'category_', body.id, function () {
            API(req, res, body, '/category/products/', function (status, response, msg) {
                var resp = JSON.parse(response);
                var categoryData = resp.data;
                if (categoryData !== undefined) {
                    var optmized_response = [];
                    async.eachOfLimit(categoryData, 5, processData, function (err) {
                        if (err) {
                            res.json({status: 0, msg: "OOPS! How is this possible?"});
                        } else {
                            client.hmset('category_' + body.id, {
                                'id': body.id,
                                "limit": body.limit,
                                "body": JSON.stringify(optmized_response)
                            });
                            client.expire('category_' + body.id, config.CATEGORY_EXPIRESAT);
                            res.json({status: status, statuscode: msg, body: JSON.stringify(optmized_response)});
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
            });
        });
    });
});

router.all('/categorylist', function (req, res) {
    validate(req, res, {countryid: 'optional',
        zip: 'optional',
        city: 'optional',
        telephone: 'optional',
        fax: 'optional',
        company: 'optional',
        street: 'optional',
        firstname: 'optional',
        lastname: 'optional',
        password: 'optional',
        newPassword: 'optional',
        secret: 'optional',
        entity_id: 'optional',
        productid: 'optional',
        store_id: 'required',
        parent_id: 'required',
        type: 'required'}, null, function (body) {
        redisFetch(req, res, 'category_', '1', body.parent_id, function () {
            API(req, res, body, '/category/categorylist/', function (status, response, msg) {
                client.hmset('category_' + body.parent_id, {
                    'parent_id': body.parent_id,
                    "body": response,
                    "type": body.type
                });
                client.expire('category_' + body.parent_id, config.CATEGORY_EXPIRESAT);
                res.json({status: status, statuscode: msg, body: response});
            });
        });
    });
});

module.exports = router;