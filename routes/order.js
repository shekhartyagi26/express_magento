require('node-import');
imports('config/index');
require('../service/secret');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.post('/alllist', function (req, res) {
    var access_token = req.headers.authorization;
    isAuth(req, res, function (secret) {
        if (access_token == UNDEFINE) {
            res.json({status: 0, statuscode: ERR_STATUS, msg: INVALID});
        } else {
            isValidate(req, res, {secret: 'required'}, secret, function (body) {
                API(req, body, '/order/alllist/', function (status, response, msg) {
                    res.json({status: status, statuscode: msg, body: response});
                });
            });
        }
    });
});

router.post('/totalorder', function (req, res) {
    var access_token = req.headers.authorization;
    isAuth(req, res, function (secret) {
        if (access_token == UNDEFINE) {
            res.json({status: 0, msg: UNDEFINE});
        } else {
            isValidate(req, res, {secret: 'required'}, secret, function (body) {
                API(req, body, '/order/totalorder/', function (status, response, msg) {
                    res.json({status: status, statuscode: msg, body: response});
                });
            });
        }
    });
});

router.post('/get', function (req, res) {
    var access_token = req.headers.authorization;
    isAuth(req, res, function (secret) {
        if (access_token == UNDEFINE) {
            res.json({status: 0, msg: UNDEFINE});
        } else {
            isValidate(req, res, {order_id: 'required',
                secret: 'required'}, secret, function (body) {
                API(req, body, '/order/get', function (status, response, msg) {
                    res.json({status: status, statuscode: msg, body: response});
                });
            });
        }
    });
});

module.exports = router;