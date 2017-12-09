var exec = require('child_process').exec;
var fs = require('fs');
var boardModel = require('./../board/model');
var mongodb = require('../../../middleware/database').mongodb.editorDb;
var TerminalConnect = require('../../../middleware/terminal-connect');

var terminalPool = {};

exports.createTerminalConnect = function (req, res, next){
    var language, classNum = req.params.classNum;

    boardModel.getClass(classNum, function (classResult) {
        if (classResult === 500){
            res.status(500).send('Err: DB select error');
        } else if (!classResult.length) {
            res.status(409).json({
                err: '없는 클래스 입니다.'
            })
        } else {
            if (req.user.nickname !== classResult[0].tutorNick && req.user.nickname !== classResult[0].studentNick) {
                res.status(401).json({
                    err: '이 클래스에 접근할 권한이 없습니다.'
                })
            } else {
                exec('docker start '+ classNum, function (err) {
                    if (err) {
                        console.log('exec error : docker start', err);
                    }
                });

                boardModel.getLanguage(classNum, function (languageResult) {
                    if (languageResult === 500) {
                        console.log('DB select error', err);
                        res.status(500).send('Err: DB select error');
                    } else {
                        language = languageResult[0].language;

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
                for(var i=0; i< result.length; i++) {
                    fs.writeFile('/root/store/' + classNum + result[i]._id, result[i].content, function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500).send("file write error");
                        } else {
                            res.status(200).send();
                        }
                    });
                }
            }
        });
        db.close();
    });

};
