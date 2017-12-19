// data (update information of directory and chat) handler

var dataSocket = null;

function DataHandler() {}

module.exports = DataHandler;

DataHandler.prototype.init = function (io) {
    dataSocket = io.of('/data');
    dataSocket.on('connection', function (socket) {
        socket.on('join', function (classNum) {
            socket.join(classNum.toString());
            console.log(classNum, '에 join');
        })
    });
};

DataHandler.prototype.sendMessage = function (classNum, message) {
    dataSocket.to(classNum).emit('chat', message);
};