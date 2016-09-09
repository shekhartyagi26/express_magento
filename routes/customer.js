var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');
var redis = require("redis"),
        client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});
client.on('connect', function () {
    console.log('connected');
});

router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (email.length > 0 && password.length > 0) {
        client.hgetall('frame', function (err, object) {
            if (object.email === email && object.password === password) {
                console.log("exist");
                console.log(object.email);
                console.log(object.password);
                console.log(object);
                res.json(object);

            } else {
                console.log('doesnt exist');
                res.json('doesnt exist');
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

                        client.hmset('frame', {
                            'email': email,
                            'password': password,
                            "body": body
                        });
                        client.hgetall('frame', function (err, object) {
                            console.log(object);
                        });
                        console.log(response.statusCode, body);
                        res.json({status: 1, statuscode: response.statusCode, body: body});
                    }
                });


            }
        });
    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
        console.log("Invalid Fields")
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
module.exports = router;

