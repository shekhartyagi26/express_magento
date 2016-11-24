require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var request_ = require('../service/request');

router.post('/alllist', function (req, res) {
    var access_token = req.headers.authorization;
    var secret = req.body.secret;
    if (secret.length > 0 && access_token.length > 0) {
        var body = ({secret: secret});
        request_.request(req, body, '/order/alllist/', function (req, response, msg) {
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
    if (access_token == UNDEFINE) {
        res.json({status: 0, msg: UNDEFINE});
    } else if (access_token.length > 0) {
        var body = ({secret: secret});
        request_.request(req, body, '/order/totalorder/', function (req, response, msg) {
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
    if (secret == UNDEFINE && access_token == UNDEFINE) {
        res.json({status: 0, msg: UNDEFINE});
    } else if (secret.length > 0) {
        var body = ({secret: secret, order_id: order_id});
        request_.request(req, body, '/order/get', function (req, response, msg) {
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