require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var request_ = require('../service/request');

router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var website_id = req.body.website_id;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    if (email == UNDEFINE && password == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else {
        var body = ({email: email, password: password, website_id: website_id});
        var headers = {APP_ID: APP_ID};
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
    }
});


router.post('/register', function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var website_id = req.body.website_id;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    if (website_id == UNDEFINE && password == UNDEFINE && email == UNDEFINE && firstname == UNDEFINE && lastname == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else {
        var body = ({firstname: firstname, lastname: lastname, email: email, password: password, website_id: website_id});
        var headers = {APP_ID: APP_ID};
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
    }
});

router.post('/forgot', function (req, res) {
    var email = req.body.email;
    var website_id = req.body.website_id;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    if (email == UNDEFINE && website_id == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else if (email.length > 0) {
        var body = ({email: email, website_id: website_id});
        var headers = {APP_ID: APP_ID};
        var url = URL + '/customer/forgot/';
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

router.post('/social_account', function (req, res) {
    var email = req.body.email;
    var website_id = req.body.website_id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var APP_ID = req.headers.app_id;
    var social_id = req.body.social_id;
    var social = req.body.social;
    var URL = req.URL;
    if (email.length > 0) {
        var body = ({email: email, website_id: website_id, firstname: firstname, lastname: lastname, social_id: social_id, social: social});
        var headers = {APP_ID: APP_ID};
        var url = URL + '/customer/social_account/';
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
