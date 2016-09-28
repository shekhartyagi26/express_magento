// the middleware function
module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1/obi');
    var Schema = mongoose.Schema;
    var conn = mongoose.connection;

    var model_schema = new Schema({
        headers: {type: String, required: true, unique: true},
        url: {type: String, required: true, unique: true}
    });
    var CollectionModel = mongoose.model('sample', model_schema);
    conn.on('error', function (err) {
        process.exit();
    })
    return function (req, res, next) {
        req.mongo = conn;
        req.gfs = gfs;
        req.app = CollectionModel;
        next();
    }

};
