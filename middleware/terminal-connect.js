var SSHClient = require('ssh2').Client;
var exec = require('child_process').exec;

module.exports = TerminalConnect;

function TerminalConnect(io, classNum, language) {
    this.nameIO = io.of('/' + classNum);
    var enteredCommand, compileCommand, errmsg;

    this.nameIO.on('connection', function (socket) {
        var conn = new SSHClient();
        conn.on('ready', function() {
            enteredCommand = '';
            conn.shell(function (err, stream) {
                if (err) {
                    return socket.emit('data', '\r\n--- Error. refresh this page please. ---: ' + err.message + ' ***\r\n');
                }
                // 프론트에서 오는 터미널 명령어
                socket.on('command', function (data) {
                    if (stream.writable) {
                        data += '\n';
                        enteredCommand = data;
                        stream.write(data);
                    } else {
                        socket.emit('data', '\r\n--- Disconnected. Please refresh this page. ---\r\n')
                    }
                }).on('run', function (maxDepth) {
                    var result = CheckCommand(classNum, maxDepth, language);
                    switch(language) {
                        case 'c' :
                            compileCommand = '/home/main';
                            break;
                        case 'java' :
                            compileCommand = 'java -cp /home com.example.Main\n';
                            break;
                        case 'c++' :
                            compileCommand = '/home/main';
                            break;
                        case 'python' :
                            compileCommand = 'python3 /home/__pycache__/*.pyc';
                            break;
                    }
                    exec(result, function(err) {
                        if(err)	{
                            errmsg = err.toString().split('\n');
                            for(var i = 1; i < errmsg.length; i++){
                                socket.emit('data', errmsg[i]);
                            }
                        } else {
                            stream.write(compileCommand + '\n');
                        }
                    });
                });
                // docker에서 오는 데이터들
                stream.on('data', function(d) {
                    var print = d.toString('binary');

                    if (enteredCommand) {
                        enteredCommand = '';
                        print = '';
                    }

                    if (compileCommand) {
                        if(print.indexOf('\n') != -1) {
                            compileCommand = '';
                            print = '';
                        } else {
                            print = '';
                        }
                    }
                    socket.emit('data', print);
                }).on('close', function() {
                    conn.end();
                });
            });
        }).on('close', function() {
            socket.emit('onClose', '\r\n*** SSH CONNECTION CLOSED ***\r\n');
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

function CheckCommand(classNum, maxDepth, language){

    var result, cd;

    switch(language) {
        case 'c' :
            result = 'gcc -o /home/main';
            for (var i = 1; i <= maxDepth; i++) {
                cd = ' home/coco/src/' + Array(i).join("*/") + '*.c';
                result += cd;
            }
            break;
        case 'java' :
            result = 'javac -d /home/';
            for (var i = 2; i <= maxDepth; i++) {
                cd = ' home/coco/com/' + Array(i).join("*/") + '*.java';
                result += cd;
            }
            break;
        case 'c++' :
            result = 'gcc -o /home/main';
            for (var i = 1; i <= maxDepth; i++) {
                cd = ' home/coco/src/' + Array(i).join("*/") + '*.cpp';
                result += cd;
            }
            break;
        case 'python' :
            result = 'rm -rf /home/__pycache__ && python3 -m compileall /home/coco && ' +
                'chmod +x /home/coco/src/__pycache__/*.pyc && mv -f /home/coco/src/__pycache__ /home';
            break;
    }

    result = 'docker exec ' + classNum + ' bash -c "' + result + '"';

    return result;
}

TerminalConnect.prototype.sendDirectoryUpdate = function (eventName, classNum, data) {
    this.nameIO.emit(eventName, data);
};
