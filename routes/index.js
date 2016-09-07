
var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');


router.all('/login', function (req, res) {

    if (jsonData[0].email.length > 0 && jsonData[0].password.length > 0) {
        request({
            url: jsonData[1].url+'/customer/login/', //URL to hit
            method: 'POST',
            headers: jsonData[0],
            body: JSON.stringify({
                email: email,
                password:password
            })

        }, function (error, response, body) {
            if (error) {
                console.log(error);
                res.json(error);
            } else {
                console.log(response.statusCode, body);
                res.json(response.statusCode, body);
            }
        });
    }
});

var html_dir = './public/';
router.get('/', function(req, res) {
    res.sendfile( html_dir + 'first.html');
    
});
router.all('/register', function (req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    console.log(email);
    if (firstname.length > 0 && lastname.length > 0 && email.length > 0 && password.length > 0) {
        request({
            url:  jsonData[1].url+'/customer/register/', //URL to hit
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
            } else {
                console.log(response.statusCode, body);
                res.json(response.statusCode, body);
            }
        });
    }

});

module.exports = router;
