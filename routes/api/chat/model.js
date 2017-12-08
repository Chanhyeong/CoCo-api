var mysql = require('../../../middleware/database').mysql;
var mongodb = require('../../../middleware/database').mongodb.chatDb;
var boardModel = require('../board/model');
var knex = require('../../../middleware/database').knex;

exports.getMessages = function (nickname, callback) {
    knex.select('num', {nickname: 'applicant'}, {classNum: 'class_number'}).from('chat').where({
        writer: nickname
    }).unionAll(function () {
        this.select('num', {nickname: 'writer'}, {classNum: 'class_number'}).from('chat').where({
            applicant: nickname
        })
    }).catch(function (err) {
        console.log(err);
        callback(500);
    }).then(callback);

};

function getChatInformation (chatNumber, callback) {
    knex.select('writer', 'applicant', {classNum: 'class_number'}).from('chat').where({
        num: chatNumber
    }).catch(function (err) {
        console.log(err);
        callback(500);
    }).then(callback);
}

exports.getChatInformation =  function (chatNumber, callback) {
    getChatInformation(chatNumber,callback);
};

exports.updateStatus = function (classNumber, applicant, callback) {
    knex.schema.raw('update class' +
        'set tutor_nickname = if(tutor_nickname is null, ?, tutor_nickname), ' +
        'student_nickname = if(student_nickname is null, ?, student_nickname), status = 3 ' +
        'where num = ?', [[applicant, applicant, classNumber]])
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};

// mode: 'matching' (매칭 중일 때의 채팅) or 'class' (에디터 접속 후 채팅)
exports.getMessage = function (mode, userNickname, chatNumber, callback) {
    var opponentNickname, isWriter;

    getChatInformation(function (result) {
        var classData = result[0];

        if (classData.writer === userNickname) {
            opponentNickname = classData.applicant;
            isWriter = true;
        } else {
            opponentNickname = classData.writer;
            isWriter = false;
        }

        boardModel.getStatus(classData.classNum, function (boardResult) {
            var classStatus = boardResult[0].status;
            mongodb(function (db) {
                db.collection(mode).findOne( { _id : chatNumber }, function (err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, [{
                            log: result.log,
                            nickname: opponentNickname,
                            status: classStatus,
                            mode: 'matching',
                            isWriter: isWriter,
                            classNum: classData.classNum
                        }]);
                    }
                });

                db.close();
            });
        });
    });
};

// 기존 Document에 메시지 추가
exports.insertMessage = function (mode, chatNumber, message, callback) {
    mongodb(function (db) {
        db.collection(mode).update( { _id: chatNumber }, {
            $push: { log: message }
        }, function (err){
            callback(err);
        });

        db.close();
    });
};

// 매칭 신청 시 + 매칭 완료 시 각각의 채팅방 생성, 관리자 안내 메시지 추가
// mode: 'matching', 'class'
exports.create = function (mode, data, time, callback) {
    data = JSON.parse(JSON.stringify(data).split('"classNum":').join('"class_number":'));
    data = JSON.parse(JSON.stringify(data).split('"startTime":').join('"start_time":'));
    data = JSON.parse(JSON.stringify(data).split('"endTime":').join('"end_time":'));

    knex.into('chat').insert(data)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(function (id) {
        var form = {
            _id: id,
            log: []
        };

        mongodb(function (db) {
            db.collection(mode).insert(form, function (err) {
                console.log(err);
                callback(500);
            });

            db.close();
        });
    });
};

exports.delete = function (chatNumber, callback) {
    mongodb(function (db) {
        db.collection('matching').remove({_id: chatNumber}, function (err) {
            if (err) {
                callback(500);
            } else {
                knex.del().from('chat').where('num', chatNumber)
                    .catch(function (err) {
                        console.log(err);
                        callback(500);
                    }).then(callback);
            }
        });
    });
};

exports.getRequestInformation = function (nickname, callback) {
    knex.select('chat.*, chat.class_number as classNum', 'class.title', 'class.language')
        .from('chat').innerJoin('class', function () {
        this.on('class.num', 'chat.class_number')
            .on('writer', '=', nickname)
            .andOn(function () {
                this.on('class.status', '=', 1)
                    .on('class.status', '=', 2)
            })
    }).catch(function (err) {
        console.log(err);
        callback(500);
    }).then(function (writerResult) {
        knex.select('chat.*, chat.class_number as classNum', 'class.title', 'class.language')
            .from('chat').innerJoin('class', function () {
            this.on('class.num', 'chat.class_number')
                .on('applicant', '=', nickname)
                .andOn(function () {
                    this.on('class.status', '=', 1)
                        .on('class.status', '=', 2)
                })
        }).catch(function (err) {
            console.log(err);
            callback(500);
        }).then(function (applicantResult) {
            callback({
                writer: writerResult,
                applicant: applicantResult
            })
        })
    });
};
