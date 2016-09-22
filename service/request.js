var request = require('request');
require('node-import');
imports('config/index');


exports.request = function (body, headers, url, callback) {
    request({
        url: config.url + url, //URL to hit
        method: 'post',
        headers: headers,
        timeout: 10000,
        body: JSON.stringify(body)
    }, function (error, result, body) {
        if (error) {
            callback(400, error, "error");
        } else if (result.statusCode == 500) {
            callback(result, body, "notfound")
        } else {
            callback(result, body, 'successfully');
        }
    });
} 