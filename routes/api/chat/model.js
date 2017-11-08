var mysql = require('../../../middleware/database')('mysql');
var mongodb = require('../../../middleware/database')('mongodb');

exports.getList = function (nickname, callback) {
    var statement = "select c.num, c.title, ch.writer, ch.applicant, " +
        "c.status, ch.num AS chatNum, ch.time " +
        "where ch.writer = ? OR ch.applicant = ? AND c.num = ch.classNum";
    var filter = [nickname, nickname];

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
                callback(result);
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
            if (err) {
                callback(err)
            } else {
                callback(null);
            }
        });

        db.close();
    });
};

// TODO: 매칭 신청 시 동시에 동작하도록
// 매칭 신청 시 새로운 채팅방 생성, 관리자 안내 메시지 추가
// mode: 'matching', 'class'
exports.create = function (mode, callback) {
    var statement2= "";
    var statement = "select c.num, c.title, c.tutorNick, c.studentNick, ch.num AS chatNum " +
        "from Class AS c inner join Chat AS ch ON c.num = ch.classNum " +
        "where tutorNick = ? OR studentNick = ?";
    var filter = [nickname, nickname];

    var chatNumber;

    var time = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');     // delete the dot and everything after

    var form = {
        _id: chatNumber,
        log: [
            {
                id: 'admin',
                message: '여기서 강의 내용에 대한 질문/답변을 진행하세요.',
                date: time
            }
        ]
    };

    mongodb(function (db) {
        db.collection(mode).insert(form, function (err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });

        db.close();
    });
};


// TODO: 채팅방 삭제 구현
exports.delete = function () {

};