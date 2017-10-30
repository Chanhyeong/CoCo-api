// data (update information of directory and chat) handler

var dataSocket = null;

exports.init = function (io) {
    dataSocket = io.of('/data');
    dataSocket.on('connection', function(socket) {
        console.log('update connection 생성');

        socket.on('join room', function (classNumber) {
            socket.join(classNumber);
            console.log(classNumber, '에 join');
        })
    });
};

exports.sendDirectory = function (classNumber, object) {
    dataSocket.to(classNumber).emit('directory', object);
};

exports.sendChatMsg = function (classNumber, message) {
    dataSocket.to(classNumber).emit('chat', message);
};