var model = require('./model');
var exec = require('child_process').exec;


exports.getDir = function (req, res) {
    exec('tree -J ~/store/' + req.params.classNum , function (err, stdout, stderr){
        if (err) {
            console.log('exec error : tree error');
            res.status(500).send('Err: exec tree error');
        }
        else{
	    res.status(200).send({
                dir : JSON.parse(stdout)
            });
        }
    });
};

exports.update = function (req, res) {
    var classNum = req.body.classNum;
    var mode = req.body.mode;
    var path = req.body.path;

    switch (mode) {
        case 'create':
            exec('docker exec ' + classNum + '');
            break;
        case 'rename':

            break;
        case 'delete':

            break;
        case 'move':

            break;
        default: console.log('wrong mode'); return false;
    }
};
