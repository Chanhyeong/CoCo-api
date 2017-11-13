var bodyParser = require('body-parser');
var share = require('./share');
var cors = require('cors');

var Middleware = {};
module.exports = Middleware ;

Middleware.init = function (server, app) {
    var io = require('socket.io')(server);

    share.init(server);
    app.set('dataHandler', require('./data-handler'));
    app.set('stream', require('./stream-service'));

    app.get('stream').init(io);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // TODO 1: 프로젝트 생성 시 소켓 생성하도록
    // TODO 2: 시작 시 모든 포트에 대한 소켓을 열기 or 프로젝트 접속자 파악해서 열고 닫기
    var TerminalConnect = require('./terminal-connect');

    new TerminalConnect(io, 8001);
};