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

router.all('/address', function (req, res) {
    var secret = req.body.secret;
    var access_token = req.headers.authorization;
    if (secret.length > 0) {
        var body = ({secret: secret});
        var headers = {APP_ID: config.APP_ID, "Authorization": access_token};
        var url = '/account/address/';
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
        res.json({status: 0, statuscode: constant.ERR_STATUS, msg: constant.INVALID});
    }
});


router.post('/changepassword', function (req, res) {
    var access_token = req.headers.authorization;
    var password = req.body.password;
    var newPassword = req.body.newPassword;
    var secret = req.body.secret;
    if (password.length > 0 && newPassword.length > 0) {
        var body = ({password: password, newPassword: newPassword, secret: secret});
        var headers = {APP_ID: config.APP_ID, "Authorization": access_token};
        var url = '/account/changepassword/';
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