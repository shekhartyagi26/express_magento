
var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');


router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (email.length > 0 && password.length > 0) {
        request({
            url: jsonData[1].url + '/customer/login/', //URL to hit
            method: 'post',
            headers: jsonData[0],
            body: JSON.stringify({
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
                res.json({status: 0, error: response.statusCode, msg: "not found"});
            } else {

                console.log(response.statusCode, body);
                res.json({status: 1, statuscode: response.statusCode, body: body});
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
            url: jsonData[1].url + '/customer/register/', //URL to hit
            method: 'POST',
            headers: jsonData[0],
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


router.post('/category/products', function (req, res) {
    var id = req.body.id;
    if (id.length > 0) {
        request({
            url: jsonData[1].url + '/category/products/', //URL to hit
            method: 'post',
            headers: jsonData[0],
            body: JSON.stringify({
                id: id,
            })
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                res.json(error);
            }
            if (response.statusCode == 500) {
                console.log("not found");
                res.json({status: 0, error: response.statusCode, msg: "not found"});
            } else {

                console.log(response.statusCode, body);
                res.json({status: 1, statuscode: response.statusCode, body: body});
            }
        });
    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
    }
});

module.exports = router;
