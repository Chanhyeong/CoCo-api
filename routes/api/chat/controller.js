var model = require('./model');
var boardModel = require('../board/model');
var fs = require('fs');
var exec = require('child_process').exec;
var editorDb = require('../../../middleware/database').mongodb.editorDb;
var ObjectId = require('mongodb').ObjectID;


// 해당 유저에 대한 전체 리스트 가져오기
exports.getMessages = function (req, res) {
    model.getMessages(req.user.nickname, function (result) {
        if (result === 500) {
            res.status(500).send();
        } else if (!result) {
            res.status(204).json({list: null});
        } else {
            res.status(200).json({list: result});
        }
    });
};

// 채팅방번호에 맞는 채팅 로그
exports.getMessage = function (req, res) {
    var chatNumber = parseInt(req.params.chatNumber);

    model.getMessage('matching', req.user.nickname, chatNumber, function (err, result) {
        // mongodb에서 검색된 내용이 바로 채워지지 않아서 nextTick 추가
        process.nextTick( function () {
            if (err) {
                res.status(500).send('Error: DB Find Error');
            } else {
                if(!result) {
                    res.status(409).send('wrong chat number');
                } else {
                    res.status(200).json(result[0]);
                }
            }
        })
    });
};

// 채팅방번호에 새로운 메시지 라인 추가
exports.sendMessage = function (req, res) {
    var chatNumber = parseInt(req.params.chatNumber);

    // Format: 2017-10-27 17:19:33
    var time = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');     // delete the dot and everything after

    var message = {
        nickname: req.user.nickname,
        message: req.body.message,
        date: time
    };

    model.insertMessage(req.body.mode, chatNumber, message, function (result) {
        if (result === 500) {
            console.log('DB insert error, mongo');
            res.status(500).send('Err: DB insert Error');
        }

        req.app.get('dataHandler').sendMessage(chatNumber, message);
        res.status(200).json(message);
    });
};

exports.handleMatch = function (req, res) {
    model.getChatInformation(req.params.chatNumber, function (result) {
        if (result === 500) {
            res.status(500).send('Err: get ChatInfo Error');
        } else {
            var classData = result[0];

            model.updateStatus(classData.classNum, classData.applicant, function (updateResult) {
                if (updateResult === 500) {
                    res.status(500).send('Err: Match Error');
                }
            });

            var dockerImageVersion;
            if (classData.language === 'c++') {
                dockerImageVersion = 'c';
            } else {
                dockerImageVersion = classData.language
            }

            process.umask(0);
            fs.mkdir('/root/store/' + classData.classNum, 0777, function (err) {
                if (err){
                    console.log('file system error, mkdir', err);
                    res.status(500).send('Err: server error');
                }
            });

            exec('docker run -d -p '+ classData.classNum +':22 -h Terminal --cpu-quota=25000 --name '+
                classData.classNum +' -v /root/store/'+ classData.classNum +':/home/coco coco:' + dockerImageVersion, function (err) {
                if (err) {
                    console.log('exec error : docker run error', err);
                    res.status(500).send('Err: docker run error');
                } else {
                    exec('docker stop '+ classData.classNum, function (err){
                        if (err) {
                            console.log('exec error : docker stop error', err);
                            res.status(500).send('Err: docker stop error');
                        }
                    });
                }
            });

            copyDefaultFilesToContainer(classData.language, classData.classNum, function (status) {
                if (status) {
                    res.status(200).send();
                } else {
                    console.log('Copy file error');
                    res.status(500).send('Err: copy file error');
                }
            });
        }
    });
};

function copyDefaultFilesToContainer (language, classNumber, callback) {
    var filePath;

    switch (language) {
        case 'c': filePath = '/src/main.c'; break;
        case 'c++': filePath = '/src/main.cpp'; break;
        case 'java': filePath = '/com/example/Main.java'; break;
        case 'python': filePath = '/src/main.py';
    }

    exec('cat /root/coco-api/default_files/' + language + '/' + filePath, function (err, fileContent) {
        if (err) {
            console.log('command error \'cat\': ', err);
            callback(false);
        }

        var createdObjectId = new ObjectId();
        var creationTime = Date.now();

        editorDb(function (db) {
            db.collection(classNumber.toString()).insertOne({ // key/values that are referenced by shraedb
                _id: filePath,
                content: fileContent,
                _type: "http://sharejs.org/types/JSONv0",
                _v: fileContent.length,
                _m: { ctime: creationTime, mtime: creationTime},
                _o: createdObjectId
            })
        });
    });

    exec('cp /root/coco-api/default_files/' + language + '/* /root/store/' + classNumber +
        ' -r &&chmod 755 /root/store/' + classNumber + ' -R', function (err) {
        if (err) {
            console.log('command error: \'cp and chmod\'', err);
            callback(false);
        } else {
            callback(true);
        }
    });
}

exports.delete = function (req, res){
    model.delete(req.params.chatNumber, function (err) {
        if (err) {
            res.status(500).send('Err: DB delete error');
        } else {
            res.status(200).send();
        }
    });
};
