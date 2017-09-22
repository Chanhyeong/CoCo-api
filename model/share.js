var ShareDB = require('sharedb');
var WebSocketServer = require('ws').Server;
var otText = require('ot-text');
var WebSocketJSONStream = require('websocket-json-stream');
var ShareDBMongo = require('sharedb-mongo');

var mongoDB = require('mongodb');
var url = "mongodb://external.sopad.ml:27017/sopad";

exports.init = function (server){
    var webSocketServer = new WebSocketServer({server: server});

    webSocketServer.on('connection', function (socket) {
        var stream = new WebSocketJSONStream(socket);
        shareDB.listen(stream);
    });
};

var db = new ShareDBMongo({
    mongo: function(callback) {
        mongoDB.connect(url, callback);
    }
});

ShareDB.types.map['json0'].registerSubtype(otText.type);
var shareDB = ShareDB({db});
