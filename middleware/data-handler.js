// data (update information of directory and chat) handler

var socket = null;

function DataHandler() {}

module.exports = DataHandler;

DataHandler.prototype.init = function (io) {
    socket = io.of('/data');
    socket.on('connect', function(socket) {
        console.log('update connect 생성');

        socket.on('join', function (classNumber) {
            socket.join(classNumber.toString());
            console.log(classNumber, '에 join');
        })
    });
};

DataHandler.prototype.sendMessage = function (classNumber, message) {
    socket.to(classNumber).emit('chat', message);
};