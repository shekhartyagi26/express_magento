var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cors = require('cors');
require('node-import');
imports('config/index');
imports('config/constant');
var redis = require("redis"),
        client = redis.createClient();
const request_ = require('../service/request');

router.post('/alllist', function (req, res) {
    var access_token = req.headers.authorization;
    var to = req.body.to;
    var from = req.body.from;
    var limit = req.body.limit;
    var secret = req.body.secret;
    if (to == constant.UNDEFINE && from == constant.UNDEFINE && limit == constant.UNDEFINE && secret == constant.UNDEFINE && access_token == constant.UNDEFINE) {
        res.json({status: 0, msg: constant.UNDEFINE});
    } else if (to.length > 0 && from.length > 0 && limit.length > 0 && secret.length > 0 && access_token.length > 0) {
        var body = ({to: to, from: from, limit: limit, secret: secret});
        var headers = {APP_ID: config.APP_ID, "Authorization": access_token};
        var url = '/order/alllist/';
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == constant.ERROR) {
                res.json({status: 0, statuscode: constant.ERR_STATUS, error: response});
            } else if (req.statusCode == constant.ERR_STATUS) {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    } else {
        res.json({status: 0, statuscode: constant.ERR_STATUS, msg: constant.INVALID});
    }
});

router.post('/totalorder', function (req, res) {
    var access_token = req.headers.authorization;
    var secret = req.body.secret;
    if (access_token == constant.UNDEFINE) {
        res.json({status: 0, msg: constant.UNDEFINE});
    } else if (access_token.length > 0) {
        var body = ({secret: secret});
        var headers = {APP_ID: config.APP_ID, "Authorization": access_token};
        var url = '/order/totalorder/';
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == constant.ERROR) {
                res.json({status: 0, statuscode: constant.ERR_STATUS, error: response});
            } else if (req.statusCode == constant.ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    } else {
        res.json({status: 0, statuscode: constant.ERR_STATUS, body: constant.INVALID});
    }
});

module.exports = router;