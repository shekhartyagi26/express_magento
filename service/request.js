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
    var file = fs.createWriteStream("public/file12.png");
    var request = http.get("http://144.76.34.244:8080/magento/1.9/web/media/app_bg/default/2_5.png", function (response) {
        response.pipe(file);
        response.on('end', function () {
            sharp('public/file12.png')
                    .resize(300, 200)
                    .toFile('public/resize/output.png', function (err) {
                        if (err) {
                            callback(500 , err)
                        }else if(err == null){
                        callback(200 ,"done")
                    }else{
                        callback(500 , "oops! some error occured")
                    }
                    });
        })
    })
}