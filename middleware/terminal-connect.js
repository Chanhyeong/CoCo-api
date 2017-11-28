var SSHClient = require('ssh2').Client;

module.exports = TerminalConnect;

function TerminalConnect(io, classNum, language){
    this.nameIO = io.of('/' + classNum);
    var statement, enteredCommand = '';

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
                }).on('compile', function(){
                    statement = 'docker exec '+ classNum +' bash -c "cd /home/coco && ';
                    switch(language){
                        case 'C' :
                            statement += 'gcc -o main -I/home/coco/* ./*.c -lm';
                            break;
                        case 'JAVA' :
                            statement += 'javac -d . *.java';
                            break;
                        case 'C++' :
                            statement += 'g++ -o main -I/home/coco/* ./*.cpp -lm';
                            break;
                        case 'Python' :
                    }
                }).on('run', function(){
                    statement = 'docker exec '+ classNum +' bash -c "cd /home/coco && ';
                    switch(language){
                        case 'C' :
                            statement =+ './main"';
                            break;
                        case 'JAVA' :
                            statement =+ 'java -cp . Board';
                            break;
                        case 'C++' :

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
