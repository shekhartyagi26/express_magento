require('node-import');
imports('config/index');
require('../service/validate');
require('../service/request');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.post('/alllist', isAuth, function (req, res) {
    validate(req, res, {secret: 'required'}, req.body.secret, function (body) {
        API(req, res, body, '/order/alllist/', function (status, response, msg) {
            res.json({status: status, statuscode: msg, body: JSON.parse(response)});
        });
    });
});

router.post('/totalorder', isAuth, function (req, res) {
    validate(req, res, {secret: 'required'}, req.body.secret, function (body) {
        API(req, res, body, '/order/totalorder/', function (status, response, msg) {
            res.json({status: status, statuscode: msg, body: JSON.parse(response)});
        });
    });
});

router.post('/get', isAuth, function (req, res) {
    validate(req, res, {order_id: 'required',
        secret: 'required'}, req.body.secret, function (body) {
        API(req, body, '/order/get', function (status, response, msg) {
            res.json({status: status, statuscode: msg, body: JSON.parse(response)});
        });
    });
});

module.exports = router;