var bodyParser = require('body-parser');
var share = require('./share');
var cors = require('cors');
var DataHandler = require('./data-handler');

var Middleware = {};
module.exports = Middleware ;

Middleware.init = function (server, app) {
    var io = require('socket.io')(server);

    share.init(server);
    app.set('dataHandler', new DataHandler);
    app.set('stream', require('./stream-service'));
    app.set('io', io);

    app.get('stream').init(io);
    app.get('dataHandler').init(io);
    require('./database').init();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers: Origin, Accept, X-Requested-With, Content-Type," +
            "Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
        next();
    });
};
