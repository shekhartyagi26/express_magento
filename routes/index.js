
var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');

request({
    url: 'http://144.76.34.244:8080/magento/1.9/web/index.php/excellence/mobile/api/v1/customer/login/', //URL to hit
    method: 'POST',
    headers: {
        'APP_ID': 'com.tethr'
    },
    body: JSON.stringify({
        email: jsonData[0].email,
        password: jsonData[0].password
    })
            //Set the body as a string
}, function (error, response, body) {
    if (error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
    }
});
module.exports = router;
