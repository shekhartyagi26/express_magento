# express_magento
You can run it by type node bin/www

# different magneto and different express(node) works together
 suppose we have different magento's and different express . In this  Express works as a middleware.
this Express middleware is best beacuse of the speed of node. i am using here request module  for accessing magento's fetching data from middleware and sending it to frontend . 
you can visit this links for better understanding of request module https://github.com/request/request.
# Redis
I am using redis to store data in cache. and creating a api from which you can flush redis cache using FLUSHDB 

router.post('/flush', function (req, res) {
    var HeaderId_ = req.HeaderId;
    client.select(HeaderId_, function (err, res) {
        client.set('key', 'string');
    });
    client.flushdb(function (err, succeeded) {
        if (err) {
            res.json({err: err, msg: "the redis data is not deleted successfully"});
        } else {
            res.json({status: succeeded, msg: "the redis data is deleted successfully"});
        }
    });
});

you can visit this links for better understanding of redis  https://www.sitepoint.com/using-redis-node-js/ . 
 
