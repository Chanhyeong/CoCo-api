var mysql = require('../../../middleware/database')('mysql');
var mongodb = require('../../../middleware/database')('mongodb').chatDb;

exports.getMessages = function (nickname, callback) {
    var statement = "select num, applicant as nickname from Chat where writer = ? " +
        "UNION ALL " +
        "select num, writer as nickname from Chat where applicant = ? " +
        "order by num;";
    var filter = [nickname, nickname];

    mysql.query(statement, filter, callback);
};


exports.changeStatus = function (Classnum, value, callback) {
    var statement = 'update Class set status = ? where num = ?';
    var filter = [value, Classnum];

    mysql.query(statement, filter, callback);
};

exports.getChatInfo =  function (Chatnum, callback){
    var statement = "select applicant, classNum from Chat where num = ?";
    var filter = Chatnum;

    mysql.query(statement, filter, callback);
};

exports.Match = function (Classnum, applicant, callback){
    var statement = "update Class " +
                    "set tutorNick = if(tutorNick is null, ?, tutorNick), studentNick = if(studentNick is null, ?, studentNick), status = 3 " +
                    "where num = ?";
    var filter = [applicant, applicant, Classnum];

    mysql.query(statement, filter, callback);
};

// 특정 Document의 message 반환
// result 값이 router로 전달되지 않아서 callback으로 설계
// mode: 'matching' (매칭 중일 때의 채팅) or 'class' (에디터 접속 후 채팅)
exports.getMessage = function (mode, chatNumber, callback) {
    mongodb(function (db) {
        db.collection(mode).findOne( { _id : chatNumber }, function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result);
            }
        });

        db.close();
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
    var statement= "insert into Chat SET ?";

    mysql.query(statement, data, function (err, result) {
        if (err) {
            callback(err);
        } else {
            var form = {
                _id: result.insertId,
                log: [
                    {
                        nickname: 'admin',
                        message: '여기서 강의 내용에 대한 질문/답변을 진행하세요.',
                        date: time
                    }
                ]
            };

            mongodb(function (db) {
                db.collection(mode).insert(form, function (err) {
                    callback(err);
                });

                db.close();
            });
        }
    });
};

exports.delete = function (Chatnum, callback) {
    mongodb(function (db) {
        db.collection('matching').delete({_id: Chatnum}, function (err) {
            if (err) {
                callback(err);
            } else {
                var statement= "delet from Chat where num = ?";
                mysql.query(statement, Chatnum, callback);
            }
        });
    });


};
