var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');

router.post('/login', function (req, res) {

    var email = req.body.email;
    var password = req.body.password;
    console.log(email);
    console.log(password);

    if (email.length > 0 && password.length > 0) {
        request({
            url: config.url + '/customer/login/', //URL to hit
            method: 'post',
            headers: {APP_ID: config.APP_ID},
            body: JSON.stringify({
                email: email,
                password: password
            })

        }, function (error, result, body) {
            if (error) {
                console.log(error);
                res.json({status: 0, error: error});
            } else if (result.statusCode == 500) {
                console.log("not found");
                res.json({status: 0, error: result.statusCode, msg: "not found"});
            } else {
                console.log(result.statusCode, body);
                res.json({status: 1, statuscode: result.statusCode, body: body});
            }
        });
    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
    }
});


router.post('/register', function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    if (firstname.length > 0 && lastname.length > 0 && email.length > 0 && password.length > 0) {
        request({
            url: config.url + '/customer/register/', //URL to hit
            method: 'POST',
            headers: {APP_ID: config.APP_ID},
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            })

        }, function (error, response, body) {
            if (error) {
                console.log(error);
                res.json(error);
            }
            if (response.statusCode == 500) {
                console.log("not found");
                res.json({status: 0, msg: "not found"});
            } else {

                console.log(response.statusCode, body);
                res.json({status: 1, statuscode: response.statusCode, body: body});
            }
        });
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});



router.post('/forgot', function (req, res) {
    var email = req.body.email;
    if (email.length > 0) {

        request({
            url: config.url + '/customer/forgot/', //URL to hit
            method: 'POST',
            headers: {APP_ID: config.APP_ID},
            body: JSON.stringify({
                email: email
            })

        }, function (error, response, body) {
            if (error) {
                console.log(error);
                res.json(error);
            }
            if (response.statusCode == 500) {
                console.log("not found");
                res.json({status: 0, msg: "not found"});
            } else {

                console.log({status: "1", statuscode: response.statusCode, body: body});
                res.json({status: 1, statuscode: response.statusCode, body: body});
            }

        });
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});


module.exports = router;

