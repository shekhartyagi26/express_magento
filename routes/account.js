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
var headers = req.headers.headers;
var verify = req.Collection;
request_.headerVerify(headers ,verify, function(headers, url,msg){
    if (secret.length > 0 && headers.length > 0 && url.length > 0) {
        var body = ({secret: secret});
        var headers_ =  {APP_ID: config.APP_ID, "Authorization": access_token};
        var url_ = url+'/account/address/';
        console.log(headers_);
        console.log(url_);
        request_.request(body, headers_, url_, function (req, response, msg) {
            if (msg == ERROR) {
                res.json({status: 0, statuscode: ERR_STATUS, error: response});
            } else if (req.statusCode == ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
                console.log(response);
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
    if (password.length > 0 && newPassword.length > 0) {
        var body = ({password: password, newPassword: newPassword, secret: secret});
        var headers = {APP_ID: config.APP_ID, "Authorization": access_token};
        console.log(headers)
        var url = '/account/changepassword/';
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