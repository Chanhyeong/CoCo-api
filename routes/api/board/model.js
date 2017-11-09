var mysql = require('../../../middleware/database')('mysql');

// Tmeporary value: mutex
// 동시에 여러 개의 글 생성 요청이 들어올 경우 한 번에 하나만
// create시 LAST_INSERT_ID(); 가 겹치는 경우를 방지
var HOLD = 0;
var FREE = 1;
var holdValue = FREE;

var status = {
    'STUDENT': 1,
    'TUTOR': 2,
    'MATCHED': 3,
    'END': 4
};

exports.getList = function (callback) {
    // IFNULL, http://ra2kstar.tistory.com/75
    var statement = 'select num, title, content, language, IFNULL(tutorNick, studentNick) AS nickname, status, date ' +
        'from Class where status IN (?, ?)';
    var filter = [status.STUDENT, status.TUTOR];

    mysql.query(statement, filter, callback);
};

exports.getInstance = function (num, callback) {
    var statement = 'select num, title, content, language, IFNULL(tutorNick, studentNick) AS nickname, ' +
        'status, date from Class where num = ?';

    mysql.query(statement, num, callback);
};

exports.create = function (data, callback) {
    var statement;

    if (data.status === status.STUDENT) {
        data['studentNick'] = data.nickname;
        data['tutorNick'] = '';
        statement = 'select * from Class where title = ? AND studentNick = ? AND status IN (?, ?)';
    } else if (data.status === status.TUTOR) {
        data['tutorNick'] = data.nickname;
        data['studentNick'] = '';
        statement = 'select * from Class where title = ? AND tutorNick = ? AND status IN (?, ?)';
    } else {
        callback(400);
        return;
    }

    // Format: 2017-10-27
    data.date = new Date().toISOString().split('T')[0];
    var timeData = data.time;

    var filter = [data.title, data.nickname, data.nickname, status.STUDENT, status.TUTOR];

    delete data.nickname;
    delete data.time;

    if (duplicateCheck(statement, filter, callback).length === 0) {
        var insertStatement = 'insert into Class (title, content, language, status, tutorNick, studentNick, date) ' +
                            'values ?';
        filter = [data.title, data,content, data.language, data.status, data.tutorNick, data.studentNick, data.date];

        // Class에 정보 저장
        mysql.query(insertStatement, filter, function (err) {
            if (err) {
                callback(err);
            } else {
                // TODO: 맞는 설계인지 확인 필요
                // 다른 요청이 잡고있지 않을 경우 (mutex 구현)
                while (holdValue === FREE) {
                    holdValue = HOLD;
                    // 마지막 입력한 클래스 번호를 받아서 Classtime에 저장
                    mysql.query('SELECT LAST_INSERT_ID();', function (err, num) {
                        if (err) {
                            callback(err);
                        } else {
                            for (var prop in timeData) {
                                prop['classNum'] = num;
                            }

                            insertStatement = 'insert into Classtime SET ?;';

                            mysql.query(insertStatement, timeData, callback);
                        }
                    });
                }
                holdValue = FREE;
            }
        });
    } else { // 이미 값이 존재할 때
        callback(409);
    }

};

// 중복 체크. return: 중복이면 true 없으면 false
function duplicateCheck (statement, filter, callback) {
    mysql.query(statement, filter, function (err, result) {
        if (err) {
            console.log('DB select err: ', err);
            callback(err);
            return true;
        } else {
            return result;
        }
    });
}

exports.handleMatch = function () {

};

exports.delete = function (nickname, num, callback) {
    var matchStatement = 'select  * from Class where num = ? AND status IN (?, ?) ' +
        'AND tutorNick = ? or studentNick = ?';
    var filter = [num, status.STUDENT, status.TUTOR, nickname, nickname];
    
    // result 값이 있다면 정보가 일치함
    if(duplicateCheck(matchStatement, filter).length !== 0) {
        var deleteStatement = 'delete from Class where num = ?';

        mysql.query(deleteStatement, num, callback);
    } else {
        callback(401);
    }
};