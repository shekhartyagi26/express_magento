require('node-import');
imports('config/index');
imports('config/constant');

isAuth = function (req, callback) {
    callback(req.body.secret);
};