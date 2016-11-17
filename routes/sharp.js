var express = require('express');
var app = express();
var router = express.Router();
var sharp = require('sharp');
var http = require('http');
var fs = require('fs');
const request_ = require('../service/request');

module.exports = router;