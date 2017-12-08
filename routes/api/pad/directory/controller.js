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
    var msg;

    var statement = 'docker exec ' + classNum + ' bash -c "cd /home/coco' + path +' && ';

    if(type === "directory"){
        statement += ('mkdir ' + fileName +'"');
	msg = "폴더 생성이 완료되었습니다.";
    } else {
        statement += ('touch ' + fileName)+'"';
	msg = "파일 생성이 완료되었습니다.";
    }

    exec(statement, function(err){
        if(err) {
            console.log (err);
            res.status(500).send();
        } else{
            res.status(200).send({msg : msg});
        }
    });
};

exports.rename = function (req, res) {
    var classNum = req.body.classNum;
    var prevName = req.body.prevName;
    var nextName = req.body.nextName;
    var type = req.body.type;
    var path = req.body.path;

    var statement = 'docker exec ' + classNum + ' bash -c "cd /home/coco' + path +' && mv ' + prevName + ' ' + nextName + '"';

    if(type === "directory"){
        exec(statement, function(err){
            if(err) {
                console.log (err);
                res.status(500).send();
            } else{
                res.status(200).send({msg : "폴더이름 변경이 완료되었습니다"});
            }
        });
    } else {
        mongodb(function (db) {
            db.collection(''+classNum).findOne({ _id: path+'/'+prevName }, function (err, result){
                if(err) {
                    console.log (err);
                    res.status(500).send();
                } else{
                    result[0]._id = path+'/'+nextName;
                    db.collection(''+classNum).insert(result[0], function (err) {
                        if(err) {
                            console.log (err);
                            res.status(500).send();
                        } else {
                            db.collection(''+classNum).remove({ _id:path+'/'+prevName }, function (err){
                                if(err) {
                                    console.log (err);
                                    res.status(500).send();
                                } else{
                                    exec(statement, function(err){
                                        if(err) {
                                            console.log (err);
                                            res.status(500).send();
                                        } else{
                                            res.status(200).send({msg : "파일이름 변경이 완료되었습니다"});
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
            db.close();
        });
    }
};


exports.delete = function (req, res) {
    var classNum = req.query.classNum;
    var type = req.query.type;
    var fileName = req.query.fileName;
    var path = req.query.path;

    var statement = 'docker exec ' + classNum + ' bash -c "cd /home/coco' + path +' && ';

    if(type === 'directory'){
        statement += 'rm -r ' + fileName +'"';
        exec(statement, function(err){
            if(err) {
                console.log (err);
                res.status(500).send();
            } else{
                res.status(200).send({msg : "폴더 삭제가 완료되었습니다"});
            }
        });
    } else {
        statement += 'rm ' + fileName +'"';

        mongodb(function (db) {
            db.collection(''+classNum).remove({_id: path+'/'+fileName }, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    exec(statement, function(err){
                        if(err) {
                            console.log (err);
                            res.status(500).send();
                        } else{
                            res.status(200).send({msg : "폴더 삭제가 완료되었습니다"});
                        }
                    });
                }
            });
            db.close();
        });
    }


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
