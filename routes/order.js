require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var request_ = require('../service/request');

router.post('/alllist', function (req, res) {
    var access_token = req.headers.authorization;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    var secret = req.body.secret;
    if (secret.length > 0 && access_token.length > 0) {
        var body = ({secret: secret});
        var headers = {APP_ID: APP_ID, "Authorization": access_token};
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
});

router.post('/totalorder', function (req, res) {
    var access_token = req.headers.authorization;
    var secret = req.body.secret;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    if (access_token == UNDEFINE) {
        res.json({status: 0, msg: UNDEFINE});
    } else if (access_token.length > 0) {
        var body = ({secret: secret});
        var headers = {APP_ID: APP_ID, "Authorization": access_token};
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
});

router.post('/get', function (req, res) {
    var access_token = req.headers.authorization;
    var secret = req.body.secret;
    var order_id = req.body.order_id;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    if (secret == UNDEFINE) {
        res.json({status: 0, msg: UNDEFINE});
    } else if (secret.length > 0) {
        var body = ({secret: secret, order_id: order_id});
        var headers = {APP_ID: APP_ID, "Authorization": access_token};
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
});

module.exports = router;