// TODO: 시작 시 모든 포트에 대한 소켓을 열기 or 프로젝트 접속자 파악해서 열고 닫기
var SSHClient = require('ssh2').Client;
var exec = require('child_process').exec;

module.exports = TerminalConnect;

function TerminalConnect(io, classNum, language){
    this.nameIO = io.of('/' + classNum);
    var enteredCommand, compileCommand;

    this.nameIO.on('connection', function(socket) {
        var conn = new SSHClient();
        conn.on('ready', function() {
            enteredCommand = '';

            conn.shell(function(err, stream) {
                
		if (err)  return socket.emit('data', '\r\n--- Error. refresh this page please. ---: ' + err.message + ' ***\r\n');
	        
		socket.on('command', function(data) {
                    if (stream.writable) {
                        data += '\n';
			enteredCommand = data;
                        stream.write(data);
                    } else {
                        socket.emit('data', '\r\n--- Disconnected. Please refresh this page. ---\r\n')
                    }
                }).on('run', function(maxDepth){
                    console.log('start RUN as ', language);
                    switch(language){
                        case 'c' :
                            var result = CheckDept(classNum, maxDepth, language);
                            compileCommand = '/home/main';
                            exec(result, function(err, stdout){
                                if(err) console.log(err);
                                else {
                                    stream.write(compileCommand + '\n');
                                }
                            });
                            break;
                        case 'java' :
                            var result = CheckDept(classNum, maxDepth, language);
                            compileCommand = 'java -cp /home com.example.Main\n';
                            exec(result, function(err, stdout){
                                if(err) console.log(err);
                                else {
                                    stream.write(compileCommand + '\n');
                                }
                            });
                            break;
                        case 'c++' :
                            var result = CheckDept(classNum, maxDepth, language);
                            compileCommand = '/home/main';
                            exec(result, function(err, stdout){
                                if(err) console.log(err);
                                else {
                                    stream.write(compileCommand + '\n');
                                }
                            });
                            break;
                        case 'python' :
                            var result = CheckDept(classNum, maxDepth, language);
			    compileCommand = 'python3 /home/__pycache__/*.pyc';
                            exec(result, function(err, stdout){
                                if(err) console.log(err);
                                else {
                                    stream.write(compileCommand + '\n');
                                }
                            });
                            break;
                    }
                });

                stream.on('data', function(d) {		
                	var print = d.toString('binary');
			console.log ('enter : ', enteredCommand);
			console.log ('print : ', print);
			if (enteredCommand) {
				enteredCommand = '';
				print = '';
			} else if (compileCommand) {
				if(print.indexOf('\n') != -1) {
					compileCommand = '';
					print = '\n';
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

	    result = 'docker exec '+classNum+' bash -c "' + result + '"';

        return result;
}

function wait(msecs)
{
    var start = new Date().getTime();
    var cur = start;
    while(cur - start < msecs)
    {
        cur = new Date().getTime();
    }
}
