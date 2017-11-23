var SSHClient = require('ssh2').Client;
var exec = require('child_process');
var model = require('./model');

exports.TerminalConnect = function (req, res){

    exec('docker start '+ req.body.classNum, function (err){
        if (err) console.log('exec error : docker start');
    });

    var enteredCommand = '';
    var language, statement, classNum = req.params.classNum;
    model.getLanguage(classNum, function (err, result) {
        if (err) {
            console.log('DB select error', err);
            res.status(500).send('Err: DB select error');
        } else {
            language = result[0];
        }
    });

    this.nameIO = req.get('io').of('/' + classNum);

    this.nameIO.on('connection', function(socket) {
        var conn = new SSHClient();
        conn.on('ready', function() {
            socket.emit('data', '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');

            conn.shell(function(err, stream) {
                if (err)
                    return socket.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');

                socket.on('command', function(data) {
                    if (stream.writable) {
                        enteredCommand = data;
                        stream.write(data + '\n');
                    } else {
                        socket.emit('data', '\r\n--- Disconnected. Please refresh this page. ---\r\n')
                    }
                }).on('compile', function(){
                    statement = 'docker exec '+ classNum +' bash -c "cd /home/coco && ';
                    switch(language){
                        case 'C' :
                            statement =+ 'gcc -o main -I ~/ *.c"';
                            break;
                        case 'JAVA' :
                            statement =+ 'javac -d . *.java"';
                            break;
                        case 'C++' :

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
            exec('docker stop '+ req.body.classNum, function (err){
                if (err) console.log('exec error : docker stop');
            });
        }).on('error', function(err) {
            socket.emit('data', '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n')
        }).connect({
            host: 'external.cocotutor.ml',
            port: classNum,
            username: 'coco',
            password: 'whdtjf123@'
        });
    })
};

