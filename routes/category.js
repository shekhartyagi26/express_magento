var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cors = require('cors');
require('node-import');
imports('config/index');
const request_ = require('../service/request');
var redis = require("redis"),
        client = redis.createClient();


router.all('/products', function (req, res) {
    var id = req.body.id;
    var page = req.body.page;
    var limit = req.body.limit;
    if (id > 0) {
        client.hgetall('category_' + id, function (err, object) {
            if (object != null && object.id == id) {
                res.json({status: 1, statuscode: "200", data: object});
            } else {
                var body = ({id: id, page: page, limit: limit});
                var headers = {APP_ID: config.APP_ID};
                var url = '/category/products/';
                request_.request(body, headers, url, function (req, response, msg) {
                    if (msg == "error") {
                        res.json({status: 0, statuscode: "500", error: response});
                    } else if (req.statusCode == 500) {
                        res.json({status: 0, statuscode: req.statusCode, body:response});
                    } else {
                        client.hmset('category_' + id, {
                            'id': id,
                            "page": page,
                            "limit": limit,
                            "body": response
                        });
                        client.expire('category_' + id, config.category_expiresAt);
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                    }
                });
            }
        });
    } else {
        res.json({status: 0, statuscode: "500", body: "Invalid Fields"});
    }
});


router.all('/categorylist', function (req, res) {
    var parent_id = req.body.parent_id;
    var type = req.body.type;
    if (parent_id > 0) {
        client.hgetall('category_' + parent_id, function (err, object) {
            if (object != null && object.parent_id == parent_id) {
                res.json({msg: "exist", statuscode: "200", data: object});
            } else {
                var body = ({parent_id: parent_id, type: type});
                var headers = {APP_ID: config.APP_ID};
                var url = '/category/categorylist/';
                request_.request(body, headers, url, function (req, response, msg) {
                    if (msg == "error") {
                        res.json({status: 0, statuscode: "500", error: response});
                    } else if (req.statusCode == 500) {
                        res.json({status: 0, statuscode: req.statusCode, body:response});
                    } else {
                        client.hmset('category_' + parent_id, {
                            'parent_id': parent_id,
                            "body": response,
                            "type": type
                        });
                        client.expire('category_' + parent_id, config.category_expiresAt);
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                    }
                });

            }
        });
    } else {
        res.json({status: 0, error: "500", body: "Invalid Fields"});
    }
});

module.exports = router;
