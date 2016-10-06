var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var verify = require('./middleware/verify.js');
var redis = require('./middleware/redis.js');

var db = require('./mods/db.js');
var app = express();


var cors = require('cors');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(db());
app.use(verify);
app.use(redis);




var routes = require('./routes/index');
var category = require('./routes/category');
var customer = require('./routes/customer');
var product = require('./routes/product');
var home = require('./routes/home');
var account = require('./routes/account');
var order = require('./routes/order');
var address = require('./routes/address');
var cart = require('./routes/cart');
var redis = require('./routes/redis');
var web = require('./routes/web');

app.use('/', routes);
app.use('/category', category);
app.use('/customer', customer);
app.use('/product', product);
app.use('/home', home);
app.use('/account', account);
app.use('/order', order);
app.use('/address', address);
app.use('/cart', cart);
app.use('/redis', redis);
app.use('/web', web);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;