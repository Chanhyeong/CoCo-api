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

exports.create = function (req, res) {
    var classNum = req.body.file.classNum;
    var type = req.body.file.type;
    var path = req.body.file.path;
    var fileName = req.body.fileName;

    var statement = 'docker exec ' + classNum + ' bash -c "cd ' + path +' && ';

    if(type === "directory"){
        statement =+ 'mkdir ' + fileName +'"';
    } else {
        statement =+ 'touch ' + fileName +'"';
    }
};

exports.rename = function (req, res) {
    var classNum = req.body.file.classNum;
    var fileName = req.body.fileName;
    var path = req.body.file.path;

    var statement = 'docker exec ' + classNum + ' bash -c "cd ' + path +' && ';

    statement =+ 'mv ' + fileName +'"';

    exec(statement);
};


exports.delete = function (req, res) {
    var classNum = req.body.file.classNum;
    var type = req.body.file.type;

    var statement = 'docker exec ' + classNum + ' bash -c "cd ' + path +' && ';

    if(req.body.Dir){
        statement =+ 'rm -r' + fileName +'"';
    } else {
        statement =+ 'rm ' + fileName +'"';
    }
};

exports.move = function (req, res) {
    var classNum = req.body.file.classNum;
    var fileName = req.body.fileName;
    var prevpath = req.body.prevpath;
    var nextpath = req.body.nextpath;

    var statement = 'docker exec ' + classNum + ' bash -c "cd ' + prevpath +' && ';

    statement =+ 'mv ' + fileName + ' ' + nextpath +'"';
};
