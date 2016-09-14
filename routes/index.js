var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');
var redis = require("redis"),
    client = redis.createClient();

module.exports = router;
