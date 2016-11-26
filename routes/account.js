require('node-import');
require('../service/auth');
require('../service/validate');
require('../service/request');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.all('/address', isAuth, function (req, res) {
    validate(req, res, {firstname: 'optional',
        lastname: 'optional',
        password: 'optional',
        newPassword: 'optional',
        zip: 'optional',
        secret: 'required'}, req.body.secret, function (body) {
        API(req, res, body, '/account/address/', function (status, response, msg) {
            res.json({status: status, statuscode: msg, body: response});
        });
    });
});

router.post('/changepassword', isAuth, function (req, res) {
    validate(req, res, {firstname: 'optional',
        lastname: 'optional',
        password: 'required',
        newPassword: 'required',
        zip: 'optional',
        secret: 'required'}, req.body.secret, function (body) {
        API(req, res, body, '/account/changepassword/', function (status, response, msg) {
            res.json({status: status, statuscode: msg, body: response});
        });
    });
});

module.exports = router;