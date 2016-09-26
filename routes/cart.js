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

router.all('/cart', function (req, res) {
    var productid = req.body.productid;
    var secret = req.body.secret;
    var access_token = req.headers.authorization;
    var verify = req.Collection;
    var headers = req.headers.app_id;
    request_.headerVerify(headers, verify, function (headers_, url_, msg) {
        if (productid > 0) {
            var body = ({productid: productid, secret: secret});
            var headers = {APP_ID: config.APP_ID, "Authorization": access_token};
            var url = url_ + '/cart/cart/';
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
            res.json({status: 0, error: ERR_STATUS, body: INVALID});
        }
    });
});
module.exports = router;