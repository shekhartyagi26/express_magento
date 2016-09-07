
var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');


router.all('/login', function (req, res) {

    if (jsonData[0].email.length > 0 && jsonData[0].password.length > 0) {
        request({
            url: 'http://144.76.34.244:8080/magento/1.9/web/index.php/excellence/mobile/api/v1' + jsonData[0].url, //URL to hit
            method: 'POST',
            headers: jsonData[1],
            body: JSON.stringify({
                email: jsonData[0].email,
                password: jsonData[0].password
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


router.all('/register', function (req, res) {
    if (jsonData[2].firstname.length > 0 && jsonData[2].lastname.length > 0 && jsonData[2].email.length > 0 && jsonData[2].password.length > 0) {
        request({
            url: 'http://144.76.34.244:8080/magento/1.9/web/index.php/excellence/mobile/api/v1' + jsonData[2].url, //URL to hit
            method: 'GET',
            headers: jsonData[1],
            body: JSON.stringify({
                firstname: jsonData[2].firstname,
                lastname: jsonData[2].lastname,
                email: jsonData[2].email,
                password: jsonData[2].password
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
