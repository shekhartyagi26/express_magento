var express = require('express');
var app = express();
var router = express.Router();
var sharp = require('sharp');
var http = require('http');
var fs = require('fs');
const request_ = require('../service/request');
var url = "http://144.76.34.244:8080/magento/1.9/web/media/app_bg/default/2_5.png";

request_.resize(url, function (status , response) {
    console.log(status,response)
});
module.exports = router;