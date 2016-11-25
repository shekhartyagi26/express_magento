require('node-import');
require('../service/secret');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.all('/cart', function (req, res) {
    isAuth(req, res, function (secret) {
        validate(req, res, {countryid: 'optional',
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
            API(req, res, body, '/cart/cart/', function (status, response, msg) {
                res.json({status: status, statuscode: msg, body: response});
            });
        });
    });
});

module.exports = router;