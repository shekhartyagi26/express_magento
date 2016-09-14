var express = require("express");
var app = express();
var path = require("path");
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(/var/www / html / shekhar / hellworld / routes + '/hello.html'));
            //__dirname : It will resolve to your project folder.
});


app.listen(3000);

console.log("Running at Port 3000");
