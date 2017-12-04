var exec = require('child_process').exec;
var model = require('./../board/model');
var mongodb = require('../../../middleware/database')('mongodb').editorDb;
var TerminalConnect = require('../../../middleware/terminal-connect');

var terminalPool = {};

exports.createTerminalConnect = function (req, res, next){
    var language, classNum = req.params.classNum;

    model.getInstance(classNum, function (err, result) {
        if (err){
            console.log('DB select error', err);
            res.status(500).send('Err: DB select error');
        }
        else {
            if (req.user.nickname !== result.tutorNick && req.user.nickname !== result.studentNick) res.status(401).send('인증되지 않은 사용자입니다.')
            else{
                exec('docker start '+ classNum, function (err){
                    if (err) console.log('exec error : docker start');
                });

                model.getLanguage(classNum, function (err, result) {
                    if (err) {
                        console.log('DB select error', err);
                        res.status(500).send('Err: DB select error');
                    } else {
                        language = result[0].language;

                        if (!terminalPool[classNum]) {
                            terminalPool[classNum] = new TerminalConnect(req.app.get('io'), classNum, language);
                        }
                        next();
                    }
                });
            }
        }
    });
};

exports.save = function (req, res){
    var classNum = req.params.classNum;

    mongodb(function (db) {
        db.collection(classNum).find({}).toArray(function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send("mongo DB err");
            } else {
                for(var i=0; i< result.length; i++){
                    exec('docker exec ' + classNum + ' bash -c "echo \'' + result[i].content + '\' > /home/coco' + result[i]._id + '"',
		    	function(err,stdout){
				if(err) console.log(err);
				else console.log(stdout);
		    });
		}
		res.status(200).send();	
            }
        });
        db.close();
    });

};
