var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cors = require('cors');
require('node-import');
imports('config/index');
var redis = require("redis"),
        client = redis.createClient();

router.all('/address', function (req, res) {

    var secret = req.body.secret;
    var access_token = req.headers.authorization;

    if (secret.length > 0) {
        request({
            url: config.url + '/account/address/', //URL to hit
            method: 'post',
            headers: {APP_ID: config.APP_ID, "Authorization": access_token},
            body: JSON.stringify({
                secret: secret
            })

        }, function (error, response, body) {
            if (error) {
                console.log(error);
                res.json(error);
            }
            if (response.statusCode == 500) {
                console.log("Token not found");
                res.json({status: 0, error: response.statusCode, msg: "Token not found"});
            } else {
                console.log("doesnt exist");
                console.log(response.statusCode, body);
                res.json({msg: "doesnt exist", statuscode: response.statusCode, body: body});
                client.expire('address_' + secret, config.account_expiresAt);
            }
        });


    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
        console.log("Invalid Fields");
    }
});

router.post('/changepassword', function (req, res) {
    var access_token = req.headers.authorization;
    var password = req.body.password;
    var newPassword = req.body.newPassword;
    var secret = req.body.secret;
    if (password.length > 0 && newPassword.length > 0) {
        request({
            url: config.url + '/account/changepassword/', //URL to hit
            method: 'POST',
            headers: {APP_ID: config.APP_ID, "Authorization": access_token},
            body: JSON.stringify({
                password: password,
                newPassword: newPassword,
                secret: secret
            })

        }, function (error, response, body) {
            if (error) {
                console.log(error);
                res.json(error);
            }
            console.log(response.statusCode);
            if (response.statusCode == 500) {
                console.log({status: 1, msg: "doesn't exist", body: body});
                res.json({status: 0, msg: "doesn't exist", body: body});
            } else {

                console.log(response.statusCode, body);
                res.json({status: 1, body: body});
            }
        });
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});

module.exports = router;