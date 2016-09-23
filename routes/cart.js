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
    if (productid > 0) {
        var body = ({productid: productid, secret: secret});
        var headers = {APP_ID: config.APP_ID, "Authorization": access_token};
        var url = '/cart/cart/';
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == Status.ERROR) {
                res.json({status: 0, statuscode: Status.ERR_STATUS, error: response});
            } else if (req.statusCode == Status.ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    } else {
        res.json({status: 0, error: Status.ERR_STATUS, body: Status.INVALID});
    }
});
module.exports = router;