require('node-import');
require('../service/secret');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.all('/address', function (req, res, next) {
    isAuth(req, function (secret) {
        var access_token = req.headers.authorization;
        if (secret.length == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            if (access_token == UNDEFINE) {
                res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
            } else {
                var body = ({secret: secret});
                API(req, body, '/account/address/', function (req, response, msg) {
                    if (msg == ERROR) {
                        res.json({status: 0, statuscode: ERR_STATUS, error: response});
                    } else if (req.statusCode == ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else {
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                    }
                });
            }
        }

    });
});

router.post('/changepassword', function (req, res) {
    var access_token = req.headers.authorization;
    var password = req.body.password;
    var newPassword = req.body.newPassword;
    isAuth(req, function (secret) {
        if (secret.length == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            if (access_token == UNDEFINE && password == UNDEFINE && newPassword == UNDEFINE) {
                res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
            } else {
                var body = ({password: password, newPassword: newPassword, secret: secret});
                API(req, body, '/account/changepassword/', function (req, response, msg) {
                    if (msg == ERROR) {
                        res.json({status: 0, statuscode: ERR_STATUS, error: response});
                    } else if (req.statusCode == ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else {
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                    }
                });
            }
        }
    });
});

module.exports = router;