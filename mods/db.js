// the middleware function
module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1/obi');
    var Schema = mongoose.Schema;
    var conn = mongoose.connection;

    var app_url_schema = new Schema({
        headers: {type: String, required: true, unique: true},
        url: {type: String, required: true, unique: true}
    });
    var AppUrls = mongoose.model('AppUrls', app_url_schema);
    conn.on('error', function (err) {
        process.exit();
    })
    return function (req, res, next) {
        req.mongo = conn;
        req.gfs = gfs;
        req.app = AppUrls;
        next();
    }

};