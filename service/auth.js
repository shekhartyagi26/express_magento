isAuth = function (req, res, callback) {
    console.log('yes');
    if (req.body.secret) {
        callback(req.body.secret);
    } else {
        res.json({status: 0, body: 'Secret Empty'});
    }
};