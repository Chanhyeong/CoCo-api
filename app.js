var http = require('http');
var express = require('express');
var app = express();
var config = require('./config');

var server = http.createServer(app);

var middleware = require('./middleware');

// initialize custom middlewares
middleware.init(server, app);

app.use('/', require('./routes'));

// 없는 경로로 이동할 시
app.use(function(req, res) {
    res.status(404).send('wrong address');
});

server.listen(config.serverPort, function (err) {
    if (err) {
        throw err;
    }
    console.log('Express listening on port', config.serverPort);
});