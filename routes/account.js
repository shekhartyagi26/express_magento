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
    var headers = req.headers.app_id;
    var verify = req.Collection;
    request_.headerVerify(headers, verify, function (headers_, url_, msg) {
        if (secret.length > 0 && headers_.length > 0 && url_.length > 0) {
            var body = ({secret: secret});
            var headers = {APP_ID: config.APP_ID, "Authorization": access_token};
            var url = url_ + '/account/address/';
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
});

router.post('/changepassword', function (req, res) {
    var access_token = req.headers.authorization;
    var password = req.body.password;
    var newPassword = req.body.newPassword;
    var secret = req.body.secret;
    var headers = req.headers.app_id;
    var verify = req.Collection;
    request_.headerVerify(headers, verify, function (headers_, url_, msg) {
        if (password.length > 0 && newPassword.length > 0) {
            var body = ({password: password, newPassword: newPassword, secret: secret});
            var headers = {APP_ID: config.APP_ID, "Authorization": access_token};

            var url = url_ + '/account/changepassword/';
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
});

module.exports = router;