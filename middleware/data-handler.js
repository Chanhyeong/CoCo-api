// data (update of directory and chat) handler

var dataSocket = null;

exports.init = function (io) {
    dataSocket = io.of('/data');
    dataSocket.on('connection', function(socket) {
        console.log('update connection 생성');

        socket.on('join room', function (roomNumber) {
            socket.join(roomNumber);
            console.log(roomNumber, '에 join');
        })
    });
};

exports.sendDirectory = function (roomNumber, object) {
    dataSocket.to(roomNumber).emit('directory', object);
};

exports.sendChatMsg = function (roomNumber, object) {
    dataSocket.to(roomNumber).emit('chat', object.userName, object.msg, object.date);
};