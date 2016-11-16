var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cors = require('cors');
require('node-import');
imports('config/index');
imports('config/constant');
const request_ = require('../service/request');
var redis = require("redis"),
        client = redis.createClient();

router.all('/products', function (req, res) {
    var id = req.body.id;
    var page = req.body.page;
    var limit = req.body.limit;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    var status = req.status;
    if (URL.length > 0) {
        if (limit == UNDEFINE && APP_ID == UNDEFINE && URL == UNDEFINE && page == UNDEFINE && id == UNDEFINE) {
            res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
        } else if (id > 0) {
            client.hgetall(headers + 'category_' + id, function (err, object) {
                if (object != null && object.id == id && status == 'enabled') {
                    res.json(object);
                } else {
                    var body = ({id: id, page: page, limit: limit});
                    var headers = {APP_ID: APP_ID};
                    var url = URL + '/category/products/';
                    request_.request(body, headers, url, function (req, response, msg) {
                        if (msg == ERROR) {
                            res.json({status: 0, statuscode: ERR_STATUS, error: response});
                        } else if (req.statusCode == ERR_STATUS) {
                            res.json({status: 0, statuscode: req.statusCode, body: response});
                        } else {
                            client.hmset(headers + 'category_' + id, {
                                'id': id,
                                "page": page,
                                "limit": limit,
                                "body": response,
                                "status": 1,
                                "statuscode": req.statusCode
                            });
                            client.expire('category_' + id, config.CATEGORY_EXPIRESAT);
                            res.json({status: 1, statuscode: req.statusCode, body: response});
                        }
                    });
                }
            });
        } else {
            res.json({status: 0, statuscode: ERR_STATUS, body: INVALID});
        }
    } else {
        res.json({status: 0, statuscode: ERR_STATUS, body: "header is not found in database"});
    }
});


router.all('/categorylist', function (req, res) {
    var parent_id = req.body.parent_id;
    var type = req.body.type;
    var store_id = req.body.store_id;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    var status = req.status;
    if (parent_id == UNDEFINE && APP_ID == UNDEFINE && URL == UNDEFINE && store_id == UNDEFINE && type == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else if (parent_id.length > 0 && type.length > 0 && store_id.length > 0 && APP_ID.length > 0) {
        client.hgetall(headers + 'category_' + parent_id, function (err, object) {
            if (object != null && object.parent_id == parent_id && status == 'enabled') {
                res.json(object);
            } else {
                var body = ({parent_id: parent_id, type: type, store_id: store_id});
                var headers = {APP_ID: APP_ID};
                var url = URL + '/category/categorylist/';
                request_.request(body, headers, url, function (req, response, msg) {
                    if (msg == ERROR) {
                        res.json({status: 0, statuscode: ERR_STATUS, error: response});
                    } else if (req.statusCode == ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else {
                        client.hmset(headers + 'category_' + parent_id, {
                            'parent_id': parent_id,
                            "body": response,
                            "type": type,
                            "status": 1,
                            "statuscode": req.statusCode
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