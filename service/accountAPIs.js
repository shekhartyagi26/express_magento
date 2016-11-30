require('node-import');
require('./validate');
require('./image');
require('./request');
require('./cache');
require('./responseMsg');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var async = require('async');

accountAddresses = function (req, res) {
    validate(req, res, {firstname: 'optional',
        lastname: 'optional',
        password: 'optional',
        newPassword: 'optional',
        zip: 'optional',
        secret: 'required'}, req.body.secret, function (body) {
        API(req, res, body, '/account/address/', function (status, response, msg) {
            success(res, status, response);
        });
    });
};