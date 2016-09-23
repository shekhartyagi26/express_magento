var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cors = require('cors');
var bodyParser = require('body-parser');
require('node-import');
imports('config/index');
imports('config/constant');

const request_ = require('../service/request');

router.post('/login', function (req, res) {

    var email = req.body.email;
    var password = req.body.password;
    if (email == Status.UNDEFINE && password == Status.UNDEFINE) {
        res.json({status: 0, msg: Status.UNDEFINE});
    } else if (email.length > 0 && password.length > 0) {

        var body = ({email: email, password: password});
        var headers = {APP_ID: config.APP_ID};
        var url = '/customer/login/';
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == Status.ERROR) {
                res.json({status: 0, statuscode: Status.ERR_STATUS, error: response});
            } else if (req.statusCode == Status.ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    } else {
        res.json({status: 0, statuscode: Status.ERR_STATUS, body: Status.INVALID});
    }
});


router.post('/register', function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    if (firstname.length > 0 && lastname.length > 0 && email.length > 0 && password.length > 0) {
        var body = ({firstname: firstname, lastname: lastname, email: email, password: password});
        var headers = {APP_ID: config.APP_ID};
        var url = '/customer/register/';
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == Status.ERROR) {
                res.json({status: 0, statuscode: Status.ERR_STATUS, error: response});
            } else if (req.statusCode == Status.ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    } else {
        res.json({status: 0, statuscode: Status.ERR_STATUS, body: Status.INVALID});
    }
});

router.post('/forgot', function (req, res) {
    var email = req.body.email;
    if (email.length > 0) {
        var body = ({email: email});
        var headers = {APP_ID: config.APP_ID};
        var url = '/customer/forget/';
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == Status.ERROR) {
                res.json({status: 0, statuscode: Status.ERR_STATUS, error: response});
            } else if (req.statusCode == Status.ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    } else {
        res.json({status: 0, statuscode: Status.ERR_STATUS, body: Status.INVALID});
    }
});

module.exports = router;