require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var website_id = req.body.website_id;
    if (email == UNDEFINE && password == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else {
        var body = ({email: email, password: password, website_id: website_id});
        API(req, body, '/customer/login/', function (req, response, msg) {
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
    if (website_id == UNDEFINE && password == UNDEFINE && email == UNDEFINE && firstname == UNDEFINE && lastname == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else {
        var body = ({firstname: firstname, lastname: lastname, email: email, password: password, website_id: website_id});
        API(req, body, '/customer/register/', function (req, response, msg) {
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
    if (email == UNDEFINE && website_id == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else if (email.length > 0) {
        var body = ({email: email, website_id: website_id});
        API(req, body, '/customer/forgot/', function (req, response, msg) {
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
    var social_id = req.body.social_id;
    var social = req.body.social;
    if (email.length > 0) {
        var body = ({email: email, website_id: website_id, firstname: firstname, lastname: lastname, social_id: social_id, social: social});
        API(req, body, '/customer/social_account/', function (req, response, msg) {
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