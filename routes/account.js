require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var request_ = require('../service/request');

router.all('/address', function (req, res) {
    var secret = req.body.secret;
    var access_token = req.headers.authorization;
    if (secret == UNDEFINE && access_token == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else {
        var body = ({secret: secret});
        request_.request(req, body, '/account/address/', function (req, response, msg) {
            if (msg == ERROR) {
                res.json({status: 0, statuscode: ERR_STATUS, error: response});
            } else if (req.statusCode == ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    }
});

router.post('/changepassword', function (req, res) {
    var access_token = req.headers.authorization;
    var password = req.body.password;
    var newPassword = req.body.newPassword;
    var secret = req.body.secret;
    if (secret == UNDEFINE && access_token == UNDEFINE && password == UNDEFINE && newPassword == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else {
        var body = ({password: password, newPassword: newPassword, secret: secret});
        request_.request(req, body, '/account/changepassword/', function (req, response, msg) {
            if (msg == ERROR) {
                res.json({status: 0, statuscode: ERR_STATUS, error: response});
            } else if (req.statusCode == ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    }
});

module.exports = router;