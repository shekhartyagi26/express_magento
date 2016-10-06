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
    var URL = req.URL;
    var APP_ID = req.headers.app_id;
    if (secret == UNDEFINE && APP_ID == UNDEFINE && URL == UNDEFINE && access_token == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else if (secret.length > 0 && access_token.length > 0 && URL.length > 0) {
        var body = ({secret: secret});
        var headers = {APP_ID: APP_ID, "Authorization": access_token};
        var url = URL + '/account/address/';
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
        res.json({status: 0, statuscode: ERR_STATUS, msg: INVALID});
    }
});

router.post('/changepassword', function (req, res) {
    var access_token = req.headers.authorization;
    var password = req.body.password;
    var newPassword = req.body.newPassword;
    var secret = req.body.secret;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    if (secret == UNDEFINE && APP_ID == UNDEFINE && URL == UNDEFINE && access_token == UNDEFINE && password == UNDEFINE && newPassword == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else if (password.length > 0 && newPassword.length > 0) {
        var body = ({password: password, newPassword: newPassword, secret: secret});
        var headers = {APP_ID: APP_ID, "Authorization": access_token};

        var url = URL + '/account/changepassword/';
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
});

module.exports = router;