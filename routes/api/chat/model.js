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

exports.getChatInfo =  function (chatNumber, callback) {
    knex.select('applicant', {classNum: 'class_number'}).from('chat').where({
        num: chatNumber
    }).catch(function (err) {
        console.log(err);
        callback(500);
    }).then(callback);
};

exports.updateStatus = function (classNumber, applicant, callback) {
    knex.schema.raw('update class' +
        'set tutorNick = if(tutorNick is null, ?, tutorNick), studentNick = if(studentNick is null, ?, studentNick), status = 3 ' +
        'where num = ?', [[applicant, applicant, classNumber]])
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};

// 특정 Document의 message 반환
// result 값이 router로 전달되지 않아서 callback으로 설계
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
            var classStatusCode = boardResult[0].status;
            mongodb(function (db) {
                db.collection(mode).findOne( { _id : chatNumber }, function (err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result, opponentNickname, classStatusCode, isWriter, classData.classNum);
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
