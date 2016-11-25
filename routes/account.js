require('node-import');
require('../service/secret');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.all('/address', function (req, res) {
    var access_token = req.headers.authorization;
    isAuth(req, res, function (secret) {
        if (access_token == UNDEFINE) {
            res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
        } else {
            isValidate(req, res, {firstname: 'optional',
                lastname: 'optional',
                password: 'optional',
                newPassword: 'optional',
                zip: 'optional',
                secret: 'required'}, secret, function (body) {
                API(req, body, '/account/address/', function (status, response, msg) {
                    res.json({status: status, statuscode: msg, body: response});
                });
            });
        }
    });
});

router.post('/changepassword', function (req, res) {
    var access_token = req.headers.authorization;
    isAuth(req, res, function (secret) {
        if (access_token == UNDEFINE) {
            res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
        } else {
            isValidate(req, res, {firstname: 'optional',
                lastname: 'optional',
                password: 'required',
                newPassword: 'required',
                zip: 'optional',
                secret: 'required'}, secret, function (body) {
                API(req, body, '/account/changepassword/', function (status, response, msg) {
                    res.json({status: status, statuscode: msg, body: response});
                });
            });
        }
    });
});

module.exports = router;