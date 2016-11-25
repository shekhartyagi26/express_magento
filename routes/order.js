require('node-import');
imports('config/index');
require('../service/secret');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.post('/alllist', function (req, res) {
    var access_token = req.headers.authorization;
    var schema = {secret: 'required'};
    isAuth(req, function (secret) {
        if (secret.length == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            if (access_token.length > 0) {
                isValidate(req, schema, secret, function (body) {
                    if (body == 0) {
                        res.json({status: 0, body: 'Secret Empty'});
                    } else {
                        API(req, body, '/order/alllist/', function (req, response, msg) {
                            if (msg == ERROR) {
                                res.json({status: 0, statuscode: ERR_STATUS, error: response});
                            } else if (req.statusCode == ERR_STATUS) {
                                res.json({status: 1, statuscode: req.statusCode, body: response});
                            } else {
                                res.json({status: 1, statuscode: req.statusCode, body: response});
                            }
                        });
                    }
                });
            } else {
                res.json({status: 0, statuscode: ERR_STATUS, msg: INVALID});
            }
        }
    });
});

router.post('/totalorder', function (req, res) {
    var access_token = req.headers.authorization;
    var schema = {secret: 'required'};
    isAuth(req, function (secret) {
        if (secret.length == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            if (access_token == UNDEFINE) {
                res.json({status: 0, msg: UNDEFINE});
            } else {
                isValidate(req, schema, secret, function (body) {
                    if (body == 0) {
                        res.json({status: 0, body: 'Secret Empty'});
                    } else {
                        API(req, body, '/order/totalorder/', function (req, response, msg) {
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

router.post('/get', function (req, res) {
    var access_token = req.headers.authorization;
    var schema = {order_id: 'required', secret: 'required'};
    isAuth(req, function (secret) {
        if (secret.length == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            if (access_token == UNDEFINE) {
                res.json({status: 0, msg: UNDEFINE});
            } else {
                isValidate(req, schema, secret, function (body) {
                    if (body == 0) {
                        res.json({status: 0, body: 'Secret Empty'});
                    } else {
                        API(req, body, '/order/get', function (req, response, msg) {
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