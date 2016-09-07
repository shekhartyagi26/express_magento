var mongoose = require('mongoose');

module.exports = function (mongoose) {

    var conn = mongoose.createConnection('mongodb://localhost');
    
    
    var users = mongoose.Schema({}, {
        strict: false,
        collection: 'users'
    });
    var table_users = conn.model('users', users);
    
    
    
    router.get('/route', function(req, res) {
     res.json("hello"); 
})
    

    return function (req, res, next) {
        req.route = route;
        next();
    }
}
exports.index = function(req, res) {
  res.json("hello"); 
};