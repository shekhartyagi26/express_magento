var request = require('request');
require('node-import');
imports('config/index');
imports('config/constant');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

exports.request = function (body, headers, url, callback) {
    request({
        url: url, //URL to hit
        method: 'post',
        headers: headers,
        timeout: 10000,
        body: JSON.stringify(body)
    }, function (error, result, body) {
        if (error) {
            callback(500, error, ERROR);
        } else if (result.statusCode == 500) {
            callback(result, body, NOTFOUND)
        } else {
            console.log(body)
            callback(result, body, SUCCESS);
        }
    });
}

exports.headerVerify = function (headers, verify, callback) {
    var promise = verify.findOne({APP_ID: headers}).exec();
    promise.then(function (verify) {
        verify.url = JSON.parse(JSON.stringify(verify)).URL;
        return verify.save(); // returns a promise
    })
            .then(function (verify) {
                callback(headers, verify.url, SUCCESS);
            })
            .catch(function (err) {
                callback(headers, err, ERROR);
            });
} 