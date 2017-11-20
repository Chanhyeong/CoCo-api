// data (update information of directory and chat) handler

var dataSocket = null;

function DataHandler() {}

module.exports = DataHandler;

DataHandler.prototype.init = function (io) {
    dataSocket = io.of('/data');
    dataSocket.on('connection', function (socket) {
        console.log('update connect 생성');

        socket.on('join', function (classNumber) {
            socket.join(classNumber.toString());
            console.log(classNumber, '에 join');
        })
    });
};

DataHandler.prototype.sendDirectory = function (classNumber, object) {
    dataSocket.to(classNumber).emit('chat', object);
};

DataHandler.prototype.sendMessage = function (classNumber, message) {
    dataSocket.to(classNumber).emit('chat', message);
};