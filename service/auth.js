isAuth = function (req, res, callback) {
    if (req.body.secret) {
        callback(req.body.secret);
    } else {
        res.json({status: 0, body: 'Secret Empty'});
    }
};
