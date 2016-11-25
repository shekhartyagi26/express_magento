require('node-import');
require('../service/secret');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.all('/cart', function (req, res) {
    var access_token = req.headers.authorization;
    isAuth(req, res, function (secret) {
        if (access_token == UNDEFINE) {
            res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
        } else {
            isValidate(req, res, {countryid: 'optional',
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
                API(req, body, '/cart/cart/', function (status, response, msg) {
                    res.json({status: status, statuscode: msg, body: response});
                });
            });
        }
    });
});

module.exports = router;