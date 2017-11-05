var Middleware = {};
module.exports = Middleware ;

Middleware.terminal = require('./terminal-connect');

Middleware.init = function (server, app) {
    var share = require('./share');

    share.init(server);
    app.set('dataHandler', require('./data-handler'));
    app.set('stream', require('./stream-service'));
};