require('node-import');
require('../service/secret');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.all('/cart', function (req, res) {
    var access_token = req.headers.authorization;
    isAuth(req, function (secret) {
        if (secret.length == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            if (access_token == UNDEFINE) {
                res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
            } else {
                isValidate(req, {countryid: 'optional',
                    zip: 'optional',
                    city: 'optional',
                    telephone: 'optional',
                    fax: 'optional',
                    company: 'optional',
                    street: 'optional',
                    firstname: 'optional',
                    lastname: 'optional',
                    password: 'optional',
                    newPassword: 'optional',
                    secret: 'required',
                    entity_id: 'optional',
                    productid: 'required',
                    store_id: 'required'}, secret, function (body) {
                    if (body == 0) {
                        res.json({status: 0, body: 'Secret Empty'});
                    } else {
                        API(req, body, '/cart/cart/', function (req, response, msg) {
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