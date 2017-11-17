var ShareDB = require('sharedb');
var WebSocketServer = require('ws').Server;
var otText = require('ot-text');
var WebSocketJSONStream = require('websocket-json-stream');
var ShareDBMongo = require('sharedb-mongo');

var mongoDB = require('mongodb');
var config = require('../config');

exports.init = function (server){
    var webSocketServer = new WebSocketServer({server: server});

    webSocketServer.on('connection', function (socket) {
        var stream = new WebSocketJSONStream(socket);
        shareDB.listen(stream);
    });
};

var db = new ShareDBMongo({
    mongo: function(callback) {
        mongoDB.connect(config.mongoUrl.editor, callback);
    }
});

ShareDB.types.map['json0'].registerSubtype(otText.type);
var shareDB = ShareDB({db});
