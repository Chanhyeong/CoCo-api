var exec = require('child_process').exec;
var mongodb = require('../../../../middleware/database')('mongodb').editorDb;


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
    var classNum = req.body.classNum;
    var type = req.body.type;
    var path = req.body.path;
    var fileName = req.body.fileName;

    var statement = 'docker exec ' + classNum + ' bash -c "cd /home/coco' + path +' && ';

    if(type === "directory"){
        statement += ('mkdir ' + fileName +'"');
    } else {
        statement += ('touch ' + fileName)+'"';
    }

    exec(statement, function(err){
        if(err) {
            console.log (err);
            res.status(500).send();
        } else{
            res.status(200).send();
        }
    });
};

exports.rename = function (req, res) {
    var classNum = req.body.classNum;
    var prevName = req.body.prevName;
    var nextName = req.body.nextName;
    var path = req.body.path;

    var statement = 'docker exec ' + classNum + ' bash -c "cd /home/coco' + path +' && mv ' + prevName + ' ' + nextName + '';

    exec(statement, function(err){
        if(err) {
            console.log (err);
            res.status(500).send();
        } else{
            res.status(200).send();
        }
    });
};


exports.delete = function (req, res) {
    var classNum = req.query.classNum;
    var type = req.query.type;
    var fileName = req.query.fileName;
    var path = req.query.path;

    var statement = 'docker exec ' + classNum + ' bash -c "cd /home/coco' + path +' && ';
	
	console.log(fileName, path);
    if(type === 'directory'){
        statement += 'rm -r ' + fileName +'"';
    } else {
        statement += 'rm ' + fileName +'"';

        mongodb(function (db) {
            db.collection(''+classNum).remove({_id: '/'+fileName+'/'}, function (err) {
                if (err) {
                    console.log(err);
		    }
            });
        });
    }

    exec(statement, function(err){
        if(err) {
            console.log (err);
            res.status(500).send();
        } else{
            res.status(200).send();
        }
    });
};

exports.move = function (req, res) {
    var classNum = req.body.classNum;
    var fileName = req.body.fileName;
    var prevpath = req.body.prevpath;
    var nextpath = req.body.nextpath;

    var statement = 'docker exec ' + classNum + ' bash -c "cd /home/coco' + prevpath +' && mv ' + fileName + ' /home/coco' + nextpath +'"';

    exec(statement, function(err){
        if(err) {
            console.log (err);
            res.status(500).send();
        } else{
            res.status(200).send();
        }
    });
};
