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
    var access_token = req.body.access_token;
    console.log({secret: secret, access_token: access_token});
    if (secret.length > 0) {
        client.hgetall('address_' + secret, function (err, object) {
            if (object != null && object.secret == secret) {
                console.log("exist");
                console.log(object.secret);
                res.json({msg: "exist", statuscode: "200", data: object});

            } else {
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
                        client.hmset('address_' + secret, {
                            'secret': secret,
                            "body": body
                        });
                        console.log("doesnt exist");
                        console.log(response.statusCode, body);
                        res.json({msg: "doesnt exist", statuscode: response.statusCode, body: body});
                        client.expire('address_' + secret, config.account_expiresAt);
                    }
                });
            }
        });
    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
        console.log("Invalid Fields");
    }
});

router.post('/changepassword', function (req, res) {
	var access_token = req.body.access_token;
    var username = req.body.username;
    var password = req.body.password;
    var confirmation = req.body.confirmation;
    var newPassword = req.body.newPassword;
    if (username.length > 0 && password.length > 0 && confirmation.length > 0 && newPassword.length > 0) {
        request({
            url: config.url + '/account/changepassword/', //URL to hit
            method: 'POST',
            headers: {APP_ID: config.APP_ID, "Authorization": access_token},
            body: JSON.stringify({
                username: username,
                password: password,
                confirmation: confirmation,
                newPassword: newPassword
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
                res.json({status: 1, msg: "changed successfully", body: body});
            }
        });
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});
module.exports = router;