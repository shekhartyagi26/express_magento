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
    var APP_id = req.headers.app_id;
    var URL = req.URL;
    if(URL.length > 0){
    if (to == UNDEFINE && from == UNDEFINE && limit == UNDEFINE && secret == UNDEFINE && access_token == UNDEFINE) {
        res.json({status: 0, msg: UNDEFINE});
    } else if (to.length > 0 && from.length > 0 && limit.length > 0 && secret.length > 0 && access_token.length > 0) {
        var body = ({to: to, from: from, limit: limit, secret: secret});
        var headers = {APP_ID: APP_id, "Authorization": access_token};
        var url = URL + '/order/alllist/';
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == ERROR) {
                res.json({status: 0, statuscode: ERR_STATUS, error: response});
            } else if (req.statusCode == ERR_STATUS) {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    } else {
        res.json({status: 0, statuscode: ERR_STATUS, msg: INVALID});
    }
     }else{
    res.json({status: 0, statuscode: ERR_STATUS, body: "header is not found in database"});
}
});

router.post('/totalorder', function (req, res) {
    var access_token = req.headers.authorization;
    var secret = req.body.secret;
    var APP_id = req.headers.app_id;
    var URL = req.URL;
    if(URL.length > 0){
    if (access_token == UNDEFINE) {
        res.json({status: 0, msg: UNDEFINE});
    } else if (access_token.length > 0) {
        var body = ({secret: secret});
        var headers = {APP_ID: APP_id, "Authorization": access_token};
        var url = URL + '/order/totalorder/';
        request_.request(body, headers, url, function (req, response, msg) {
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
     }else{
    res.json({status: 0, statuscode: ERR_STATUS, body: "header is not found in database"});
}
});

router.post('/get', function (req, res) {
    var secret = req.body.secret;
    var order_no = req.body.order_no;
    var APP_id = req.headers.app_id;
    var URL = req.URL;
    if(URL.length > 0){
    if (secret == UNDEFINE) {
        res.json({status: 0, msg: UNDEFINE});
    } else if (secret.length > 0) {
        var body = ({secret: secret, order_no: order_no});
        var headers = {APP_ID: APP_id};
        var url = URL + '/order/get';
        request_.request(body, headers, url, function (req, response, msg) {
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
     }else{
    res.json({status: 0, statuscode: ERR_STATUS, body: "header is not found in database"});
}
});

module.exports = router;