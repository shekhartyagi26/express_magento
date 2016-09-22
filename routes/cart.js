var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cors = require('cors');
require('node-import');
imports('config/index');
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
            res.json({status: 1, statuscode: req.statusCode, body: response, msg :msg});
        });
    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
    }
});
module.exports = router;