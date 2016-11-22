var request = require('request');
var sharp = require('sharp');
var http = require('http');
var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');
var fs = require('fs');
var URL_ = require('url');
var mkdirp = require('mkdirp');
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
        } else if (result.statusCode === 500) {
            callback(result, body, NOTFOUND)
        } else {
            callback(result, body, SUCCESS);
        }
    });
};

exports.resize = function (url, APP_ID, callback) {

    if (url.length > 0 && APP_ID.length > 0) {
        var image_url = URL_.parse(url).path;
        var app_id = APP_ID.replace(/[^a-zA-Z0-9 ]/g, "");
        var image_stored_url = app_id + image_url;
        var url_last_index_length = url.lastIndexOf('/');
        var image_name = url.substring(url_last_index_length + 1);
        var filename = image_stored_url.substring(0, image_stored_url.lastIndexOf("/"));

        fs.readFile('public/resize/' + image_name, function (err, data) {
            if (err) {
                mkdirp('public/' + filename, function (err) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log('pow!');
                    }
                });
                var file = fs.createWriteStream("public/" + image_name);
                http.get(url, function (response) {
                    response.pipe(file);
                    response.on('end', function () {
                        sharp('public/' + image_name)
                                .resize(300, 200)
                                .toFile('public/' + image_stored_url, function (err) {
                                    if (err) {
                                        callback(500, err);
                                    } else if (err === null) {
                                        callback(200, "done", image_stored_url);
                                    } else {
                                        callback(500, "oops! some error occured");
                                    }
                                });
                    });
                });
            } else {
                callback(200, "done", image_name);
            }
        })
    } else {
        callback(500, " APP_ID or url cannot be empty");
    }
};

exports.minify = function (url, APP_ID, callback) {
    if (url.length > 0 && APP_ID.length > 0) {
        var image_url = URL_.parse(url).path;
        var app_id = APP_ID.replace(/[^a-zA-Z0-9 ]/g, "");
        var image_stored_url = app_id + image_url;
        var url_last_index_length = url.lastIndexOf('/');
        var image_name = url.substring(url_last_index_length + 1);
        fs.readFile('public/resize/' + image_name, function (err, data) {
        if (err) {
        var file = fs.createWriteStream("public/" + image_name);
                http.get(url, function (response) {
                response.pipe(file);
                        response.on('end', function () {
                        imagemin(['public/' + image_name], 'public/' + image_url, {
                        plugins: [
                                imageminMozjpeg(),
                                imageminPngquant({quality: '65-80'})
                        ]
                        }).then(files => {
                            if (files[0].path !== null) {
                                callback(200, "done", image_stored_url);
                            } else {
                                callback(500, "oops! some error occured");
                            }
                        })
                    });
                })
            } else{
                callback(200, "done", image_stored_url);
            }
        })
     } else{
            callback(500, " APP_ID or url cannot be empty");
    }
};