require('node-import');
require('../service/auth');
require('../service/validate');
require('../service/request');
require('../service/responseMsg');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.all('/cart', isAuth, function (req, res) {
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
        store_id: 'required'}, req.body.secret, function (body) {
        API(req, res, body, '/cart/cart/', function (status, response, msg) {
            resMsg(res, status, response);
//            res.json({status: status, statuscode: msg, body: response});
        });
    });
});

module.exports = router;