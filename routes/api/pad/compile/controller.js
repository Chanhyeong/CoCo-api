var SSHClient = require('ssh2').Client;
var exec = require('child_process');

exports.TerminalConnect = function (req, res){

    exec('docker start '+ req.body.Classnum, function (err){
        if (err) console.log('exec error : docker stop');
    });

    this.nameIO = req.get('io').of('/' + req.params.Classnum);

    this.nameIO.on('connection', function(socket) {
        var conn = new SSHClient();
        conn.on('ready', function() {
            socket.emit('data', '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');

            conn.shell(function(err, stream) {
                if (err)
                    return socket.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
                socket.on('command', function(data) {
                    stream.write(data + '\n')
                });
                stream.on('data', function(d) {
                    socket.emit('data', d.toString('binary'));
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
            port: req.params.Classnum,
            username: 'coco',
            password: 'whdtjf123@'
        });
    })
};

exports.Compile = function (req, res){
    language = req.params.language;

    switch(language){
        case 'C' :
            exec('docker exec '+ req.params.Classnum +' bash -c "cd /home/coco && gcc -o main -I ~/ *.c"', function (err){
                if (err) console.log('exec error : Compile error');
                else {
                    if(Run(req.params.Classnum)===true){
                        res.status(200).send();
                    }
                    else{
                        res.status(500).send('Err : server compile error');
                    }
                }
            });
            break;
        case 'JAVA' :

            break;
        case 'C++' :

            break;
        case 'Python' :
    }
};

function Run(num){
    exec('docker exec '+ num +' bash -c "cd /home/coco && gcc -o main -I ~/ *.c"', function (err){
        if (err) {
            console.log('exec error : Run error');
            return false;
        }
        else{
            return true;
        }
    });
}