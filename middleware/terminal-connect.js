var SSHClient = require('ssh2').Client;

module.exports = TerminalConnect;

function TerminalConnect(io, _id){
    this.nameIO = io.of('/' + _id);
    var enteredCommand = null;

    this.nameIO.on('connection', function(socket) {
        var conn = new SSHClient();
        conn.on('ready', function() {
            socket.emit('data', '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');
	     enteredCommand = null;

            conn.shell(function(err, stream) {
                if (err)
                    return socket.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
                socket.on('command', function(data) {
		     enteredCommand = data;
                    stream.write(data + '\n');
                });
                stream.on('data', function(d) {
		     var printFromContainer = d.toString('binary');
		     if (enteredCommand) {
		         printFromContainer = printFromContainer.replace(enteredCommand, '').replace(/\n/, '');
		     } else {
		         if(printFromContainer.slice(-2) !== '$ ')
			     printFromContainer = '';
		     }
		     enteredCommand = null;
                    socket.emit('data', printFromContainer);
                }).on('close', function() {
                    conn.end();
                });
            });
        }).on('close', function() {
            socket.emit('data', '\r\n*** SSH CONNECTION CLOSED ***\r\n');
        }).on('error', function(err) {
            socket.emit('data', '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n')
        }).connect({
            host: 'external.cocotutor.ml',
            port: _id,
            username: 'coco',
            password: 'whdtjf123@'
        });
    })
}

// TODO: 프로젝트 접속인원 파악 가능하면 소켓 destroy 구현
