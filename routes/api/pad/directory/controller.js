var exec = require('child_process').exec;


exports.getDirectory = function (req, res) {

    exec('tree -J ~/store/' + req.params.classNum , function (err, stdout){
        if (err) {
            console.log('exec error : tree error');
            res.status(500).send('Err: exec tree error');
        }
        else{
            stdout = stdout.replace(/name/ig,"title");
            stdout = stdout.replace(/contents/ig,"children");

            var result = JSON.parse(stdout);

            res.status(200).json({
                dir : result[0].children
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
