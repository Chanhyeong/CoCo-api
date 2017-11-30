var SSHClient = require('ssh2').Client;
var exec = require('child_process').exec;

module.exports = TerminalConnect;

function TerminalConnect(io, classNum, language){
    this.nameIO = io.of('/' + classNum);
    var statement, compile, run, enteredCommand = '';

    io.
    this.nameIO.on('connection', function(socket) {
        var conn = new SSHClient();
        conn.on('ready', function() {
            socket.emit('data', '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');
            enteredCommand = null;

            conn.shell(function(err, stream) {
                if (err)
                    return socket.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
                socket.on('command', function(data) {
                    if (stream.writable) {
                        enteredCommand = data;
                        data += '\n';
                        stream.write(data);
                    } else {
                        socket.emit('data', '\r\n--- Disconnected. Please refresh this page. ---\r\n')
                    }
                }).on('run', function(){
                    switch(language){
                        case 'C' :
                            stream.write('gcc -o main -I/home/coco/* ./*.c -lm\n');
                            stream.write('./main\n');
                            break;
                        case 'JAVA' :
                            stream.write('javac -d . *.java\n');
                            stream.write('java -cp . Board\n');
                            break;
                        case 'C++' :
                            stream.write('g++ -o main -I/home/coco/* ./*.cpp -lm\n');
                            stream.write('./main\n');
                            break;
                        case 'Python' :
                    }
                });

                stream.on('data', function(d) {
                    var printFromContainer = d.toString('binary');

                    if(printFromContainer.slice(-2) === '$ '){}
                    else if (enteredCommand || printFromContainer === '\n' || printFromContainer === ' \n') {
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
            port: classNum,
            username: 'coco',
            password: 'whdtjf123@'
        });
    })
}
