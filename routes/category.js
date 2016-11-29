require('node-import');
require('../service/validate');
require('../service/request');
require('../service/cache');
require('../service/responseMsg');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var async = require('async');
var request_ = require('../service/request');
var image_ = require('../service/image');

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
        id: 'required',
        mobile_width: 'required'}, null, function (body) {
        redisFetch(req, res, 'category_', body.id, null, function () {
            API(req, res, body, '/category/products/', function (status, response, msg) {
                if (response !== undefined) {
                    var optmized_response = [];
                    async.eachOfLimit(response, 5, processData, function (err) {
                        if (err) {
                            res.json({status: 0, msg: "OOPS! How is this possible?"});
                        } else {
                            redisSet('category_', body.id, body.limit, JSON.stringify(optmized_response), null, function () {
                                res.json({status: status, statuscode: msg, body: JSON.stringify(optmized_response)});
                            });
                        }
                    });
                } else {
                    res.json({status: 0, statuscode: '500', body: ERROR});
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
                            })
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
        redisFetch(req, res, 'category_', body.parent_id, body.type, function () {
            API(req, res, body, '/category/categorylist/', function (status, response, msg) {
                redisSet('category_', body.parent_id, null, response, body.type, function () {
                    success(res, status, response);
                    // res.json({status: status, statuscode: msg, body: response});
                });
            });
        });
    });
});

module.exports = router;