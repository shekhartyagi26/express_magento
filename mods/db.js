// the middleware function
module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1/obi');
 
    var conn = mongoose.connection;
 
    // incase you need gridfs
    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
    var gfs = Grid(conn.db);
 
    var model_schema_user = mongoose.Schema({}, {
        strict: false,
        collection: 'users'
    });
    var CollectionModel_user = conn.model('users', model_schema_user);
    var model_schema = mongoose.Schema({}, {
        strict: false,
        collection: 'sample'
    });
    var CollectionModel = conn.model('sample', model_schema);
 var model_schema_task = mongoose.Schema({}, {
        strict: false,
        collection: 'tasks'
    });
    var CollectionModel_task = conn.model('tasks', model_schema_task); 
    
    conn.on('error', function (err) {
        console.log(err);
        process.exit();
    })
    return function (req, res, next) {
        req.mongo = conn;
        req.gfs = gfs;
        req.Collection_user = CollectionModel_user;
        req.Collection_task = CollectionModel_task;
        req.Collection = CollectionModel;
        next();
    }
 
};
