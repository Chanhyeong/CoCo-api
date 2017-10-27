// data (update information of directory and chat) handler

var dataSocket = null;

exports.init = function (io) {
    dataSocket = io.of('/data');
    dataSocket.on('connection', function(socket) {
        console.log('update connection 생성');

        socket.on('join room', function (classId) {
            socket.join(classId);
            console.log(classId, '에 join');
        })
    });
};

exports.sendDirectory = function (classId, object) {
    dataSocket.to(classId).emit('directory', object);
};

exports.sendChatMsg = function (classId, message) {
    dataSocket.to(classId).emit('chat', message);
};