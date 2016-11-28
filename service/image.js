require('node-import');
imports('config/index');
imports('config/constant');
var request = require('request');
var fileExists = require('file-exists');
var sharp = require('sharp');
var http = require('http');
var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');
var fs = require('fs');
var URL_ = require('url');
var mkdirp = require('mkdirp');
var path = require('path');

resize = function (url, APP_ID, mobile_width, callback) {
    if (url && APP_ID) {
        if (mobile_width) {
            mobile_width = mobile_width;
        } else {
            mobile_width = 200;
        }
        var image_url = URL_.parse(url).path;
        var app_id = APP_ID.replace(/[^a-zA-Z0-9 ]/g, "");
        var image_stored_url = app_id + '/' + mobile_width + image_url;
        var url_last_index_length = url.lastIndexOf('/');
        var image_name = url.substring(url_last_index_length + 1);
        var filename = image_stored_url.substring(0, image_stored_url.lastIndexOf("/"));
        if (fileExists('public/original_image/' + image_name) == false) {
            mkdirp('public/' + filename, function (err) {
                if (err) {
                    callback(500, "oops! some error occured");
                } else {
                    console.log('pow!');
                }
            });
            var width = JSON.parse(mobile_width);
            var file = fs.createWriteStream("public/original_image/" + image_name);
            http.get(url, function (response) {
                if (response.statusCode == 200) {
                    response.pipe(file);
                    image_name = image_name;
                } else {
                    image_name = 'default/default.jpg';
                }
                response.on('end', function () {
                    sharp('public/original_image/' + image_name)
                            .resize(width)
                            .toFile('public/' + filename + image_name, function (err) {
                                if (err) {
                                    callback(500, err);
                                } else if (err === null) {
                                    callback(200, "done", config.IMAGE_URL + filename + image_name);
                                } else {
                                    callback(500, "oops! some error occured");
                                }
                            });
                });
            });
        } else {
            callback(200, "done", config.IMAGE_URL + image_stored_url);
        }
    } else {
        callback(500, " APP_ID or url or mobile_width cannot be empty");
    }
};

minify = function (url, APP_ID, callback) {
    if (url && APP_ID) {
        var image_url = URL_.parse(url).path;
        var image_fetch_url = image_url.replace("/shekhar_works/Eexpress_magento/public/", "");
        var filename = image_fetch_url.substring(0, image_fetch_url.lastIndexOf("/"));
        var url_last_index_length = url.lastIndexOf('/');
        var image_name = url.substring(url_last_index_length + 1);
        if (fileExists('public/minify/' + filename + '/' + image_name) == false) {
                 imagemin(["public/original_image/" + image_name], 'public/minify/' + filename, {
                  plugins: [
                  imageminMozjpeg(),
                  imageminPngquant({quality: '5'})
                  ]
                 }).then(files => {
                      if (files[0].path !== null) {
                          callback(200, "done", config.IMAGE_MINIFY_URL+image_fetch_url );
                      } else {
                          callback(500, "oops! some error occured");
                      }
            })
        } else {
            callback(200, "done", config.IMAGE_MINIFY_URL + image_fetch_url);
        }
    } else {
        callback(500, " APP_ID or url cannot be empty");
    }
};