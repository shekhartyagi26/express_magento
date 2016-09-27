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
    var website_id = req.body.website_id;
    var URL = req.URL;
    if (email == UNDEFINE && password == UNDEFINE) {
        res.json({status: 0, msg: UNDEFINE});
    } else if (email.length > 0 && password.length > 0) {
        var body = ({email: email, password: password, website_id: website_id});
        var headers = {APP_ID: config.APP_ID};
        var url = URL + '/customer/login/';
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == ERROR) {
                res.json({status: 0, statuscode: ERR_STATUS, error: response});
            } else if (req.statusCode == ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    } else {
        res.json({status: 0, statuscode: ERR_STATUS, body: INVALID});
    }
});


router.post('/register', function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var website_id = req.body.website_id;
    var URL = req.URL;
    if (firstname.length > 0 && lastname.length > 0 && email.length > 0 && password.length > 0) {
        var body = ({firstname: firstname, lastname: lastname, email: email, password: password, website_id: website_id});
        var headers = {APP_ID: config.APP_ID};
        var url = URL + '/customer/register/';
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == ERROR) {
                res.json({status: 0, statuscode: ERR_STATUS, error: response});
            } else if (req.statusCode == ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    } else {
        res.json({status: 0, statuscode: ERR_STATUS, body: INVALID});
    }
});

router.post('/forgot', function (req, res) {
    var email = req.body.email;
    var URL = req.URL;
    var website_id = req.body.website_id;
    if (email.length > 0) {
        var body = ({email: email, website_id: website_id});
        var headers = {APP_ID: config.APP_ID};
        var url = URL + '/customer/forget/';
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == ERROR) {
                res.json({status: 0, statuscode: ERR_STATUS, error: response});
            } else if (req.statusCode == ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    } else {
        res.json({status: 0, statuscode: ERR_STATUS, body: INVALID});
    }
});

module.exports = router;
