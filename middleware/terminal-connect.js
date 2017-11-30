var SSHClient = require('ssh2').Client;

module.exports = TerminalConnect;

function TerminalConnect(io, classNum, language){
    this.nameIO = io.of('/' + classNum);
    var enteredCommand = '';

    this.nameIO.on('connection', function(socket) {
        var conn = new SSHClient();
        conn.on('ready', function() {
            enteredCommand = null;

            conn.shell(function(err, stream) {
                if (err)
                    return socket.emit('data', '\r\n--- Error. refresh this page please. ---: ' + err.message + ' ***\r\n');
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
                        case 'c' :
                            enteredCommand = 'gcc -o main -I/home/coco/* ./*.c -lm';
			    stream.write('gcc -o main -I/home/coco/* ./*.c -lm\n');
			    enteredCommand = './main';
                            stream.write('./main\n');
                            break;
                        case 'java' :
			enteredCommand = 'javac -d . *.java';
                            stream.write('javac -d . *.java\n');
			    enteredCommand = 'java -cp . Board';
			    stream.write('java -cp . Board\n');
                            break;
                        case 'c++' :
		            enteredCommand = 'g++ -o main -I/home/coco/* ./*.cpp -lm';
                            stream.write('g++ -o main -I/home/coco/* ./*.cpp -lm\n');
			    enteredCommand = './main';
                            stream.write('./main\n');
                            break;
                        case 'python' :
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
