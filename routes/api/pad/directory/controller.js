var model = require('./model');
var exec = require('child_process').exec;


exports.getDir = function (req, res) {
    exec('tree -J ~/store/' + req.params.classNum , function (err, stdout){
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
    var newpath = req.body.newpath;
    var fileName = req.body.fileName;

    var statement = 'docker exec ' + classNum + ' bash -c "cd ' + path +' && ';

    switch (mode) {
        case 'create':
            if(req.body.Dir){
                statement =+ 'mkdir ' + fileName +'"';
            } else {
                statement =+ 'touch ' + fileName +'"';
            }
            break;

        case 'rename':
            statement =+ 'mv ' + fileName +'"';
            break;

        case 'delete':
            if(req.body.Dir){
                statement =+ 'rm -r' + fileName +'"';
            } else {
                statement =+ 'rm ' + fileName +'"';
            }
            break;

        case 'move':
            statement =+ 'mv ' + fileName + ' ' + newpath+'"';
            break;
        default: console.log('wrong mode'); return false;
    }

    exec(statement);
};
