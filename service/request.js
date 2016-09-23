var request = require('request');
require('node-import');
imports('config/index');
imports('config/constant');

exports.request = function (body, headers, url, callback) {
    request({
        url: config.URL + url, //URL to hit
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
            callback(result, body, SUCCESS);
        }
    });
} 