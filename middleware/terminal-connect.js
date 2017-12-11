// TODO: 시작 시 모든 포트에 대한 소켓을 열기 or 프로젝트 접속자 파악해서 열고 닫기
var SSHClient = require('ssh2').Client;
var exec = require('child_process').exec;

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
                }).on('run', function(maxDepth){
                    switch(language){
                        case 'c' :
			                var result = CheckDept(classNum, maxDepth, language);
                            exec(result, function(err, stdout){
			    	            if(err) console.log(err);
                                else {
					                stream.write(stdout);
					                enteredCommand = '/home/main\n';
					                stream.write('/home/main\n');
				                }
                            });
                            break;
                        case 'java' :
                            var result = CheckDept(classNum, maxDepth, language);
                            exec(result, function(err, stdout){
                                if(err) console.log(err);
                                else {
                                    stream.write(stdout);
                                    enteredCommand = 'java -cp /home Main.Main\n';
                                    stream.write('java -cp /home Main.Main\n');
                                }
                            });
                            break;
                        case 'c++' :
                            var result = CheckDept(classNum, maxDepth, language);
                            exec(result, function(err, stdout){
                                if(err) console.log(err);
                                else {
                                    stream.write(stdout);
                                    enteredCommand = '/home/main\n';
                                    stream.write('/home/main\n');
                                }
                            });
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

function CheckDept(classNum, maxDepth, language){

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
                    cd = ' home/coco/com/example' + Array(i).join("*/") + '*.java';
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
                for (var i = 1; i <= maxDepth; i++) {
                    cd = ' home/coco/src/' + Array(i).join("*/") + '*.java';
                    result += cd;
                }
                break;
        }

	    result = 'docker exec '+classNum+' sh -c "' + result + '"';

        return result;
}
