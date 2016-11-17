var request = require('request');
var sharp = require('sharp');
var http = require('http');
var fs = require('fs');
require('node-import');
imports('config/index');
imports('config/constant');

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
            callback(result, body, SUCCESS);
        }
    });
}

exports.resize = function (url, callback) {
    var n = url.lastIndexOf('/');
    var image_name = url.substring(n + 1);
    var file = fs.createWriteStream("public/" + image_name);
    var request = http.get(url, function (response) {
        response.pipe(file);
        response.on('end', function () {
            sharp('public/' + image_name)
                    .resize(300, 200)
                    .toFile('public/resize/' + 'S' + image_name, function (err) {
                        if (err) {
                            callback(500, err)
                        } else if (err == null) {
                            callback(200, "done")
                        } else {
                            callback(500, "oops! some error occured")
                        }
                    })
        })
    })
}