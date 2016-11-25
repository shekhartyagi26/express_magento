require('node-import');
require('../service/auth');
require('../service/validate');
require('../service/cache');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.post('/login', function (req, res) {
    validate(req, res, {countryid: 'optional',
        zip: 'optional',
        city: 'optional',
        telephone: 'optional',
        fax: 'optional',
        company: 'optional',
        street: 'optional',
        firstname: 'optional',
        lastname: 'optional',
        password: 'required',
        newPassword: 'optional',
        secret: 'optional',
        entity_id: 'optional',
        productid: 'optional',
        store_id: 'optional',
        parent_id: 'optional',
        type: 'optional',
        website_id: 'required',
        email: 'required'}, null, function (body) {
        API(req, res, body, '/customer/login/', function (status, response, msg) {
            res.json({status: status, statuscode: msg, body: response});
        });
    });
});

router.post('/register', function (req, res) {
    validate(req, res, {countryid: 'optional',
        zip: 'optional',
        city: 'optional',
        telephone: 'optional',
        fax: 'optional',
        company: 'optional',
        street: 'optional',
        firstname: 'required',
        lastname: 'required',
        password: 'required',
        newPassword: 'optional',
        secret: 'optional',
        entity_id: 'optional',
        productid: 'optional',
        store_id: 'optional',
        parent_id: 'optional',
        type: 'optional',
        website_id: 'required',
        email: 'required'}, null, function (body) {
        API(req, res, body, '/customer/register/', function (status, response, msg) {
            res.json({status: status, statuscode: msg, body: response});
        });
    });
});

router.post('/forgot', function (req, res) {
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
        secret: 'optional',
        entity_id: 'optional',
        productid: 'optional',
        store_id: 'optional',
        parent_id: 'optional',
        type: 'optional',
        website_id: 'required',
        email: 'required'}, null, function (body) {
        API(req, res, body, '/customer/forgot/', function (status, response, msg) {
            res.json({status: status, statuscode: msg, body: response});
        });
    });
});

router.post('/social_account', function (req, res) {
    validate(req, res, {countryid: 'optional',
        zip: 'optional',
        city: 'optional',
        telephone: 'optional',
        fax: 'optional',
        company: 'optional',
        street: 'optional',
        firstname: 'required',
        lastname: 'required',
        password: 'optional',
        newPassword: 'optional',
        secret: 'optional',
        entity_id: 'optional',
        productid: 'optional',
        store_id: 'optional',
        parent_id: 'optional',
        type: 'optional',
        website_id: 'required',
        email: 'required',
        social: 'required',
        social_id: 'required'}, null, function (body) {
        API(req, res, body, '/customer/social_account/', function (status, response, msg) {
            res.json({status: status, statuscode: msg, body: response});
        });
    });
});

module.exports = router;