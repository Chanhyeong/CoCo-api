// data (update information of directory and chat) handler

var socket = null;

function dataHandler() {}

module.exports = dataHandler;

dataHandler.prototype.init = function (io) {
    socket = io.of('/data');
    socket.on('connection', function(socket) {
        console.log('update connection 생성');

        socket.on('join room', function (classNumber) {
            socket.join(classNumber.toString());
            console.log(classNumber, '에 join');
        })
    });
};

dataHandler.prototype.sendDirectory = function (classNumber, object) {
    socket.to(classNumber).emit('directory', object);
};

dataHandler.prototype.sendChatMsg = function (classNumber, message) {
    socket.to(classNumber).emit('chat', message);
};