require('node-import');
require('../service/secret');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.all('/address', function (req, res) {
    var access_token = req.headers.authorization;
    var schema = {firstname: 'optional', lastname: 'optional', password: 'optional',
        newPassword: 'optional', zip: 'optional', secret: 'required'};
    isAuth(req, function (secret) {
        if (secret.length == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            if (access_token == UNDEFINE) {
                res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
            } else {
                isValidate(req, schema, secret, function (body) {
                    if (body == 0) {
                        res.json({status: 0, body: 'Fill required fields!'});
                    } else {
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
                });
            }
        }
    });
});

router.post('/changepassword', function (req, res) {
    var access_token = req.headers.authorization;
    var schema = {firstname: 'optional', lastname: 'optional', password: 'required',
        newPassword: 'required', zip: 'optional', secret: 'required'};
    isAuth(req, function (secret) {
        if (secret.length == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            if (access_token == UNDEFINE) {
                res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
            } else {
                isValidate(req, schema, secret, function (body) {
                    if (body == 0) {
                        res.json({status: 0, body: 'Fill required fields!'});
                    } else {
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
                });
            }
        }
    });
});

module.exports = router;