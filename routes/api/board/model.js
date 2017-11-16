var mysql = require('../../../middleware/database')('mysql');

var status = {
    'STUDENT': 1,
    'TUTOR': 2,
    'MATCHED': 3,
    'END': 4
};

exports.changeStatus = function (num, value, callback) {
    var statement = 'update Class set status = ? where num = ?';
    var filter;

    if (typeof value === 'string')
        filter = [num, status[value]];
    else
        filter = [num, value];

    mysql.query(statement, filter, callback);
};

exports.getClasses = function (callback) {
    // IFNULL, http://ra2kstar.tistory.com/75
    var statement = 'select num, title, language, IFNULL(tutorNick, studentNick) AS nickname, status, date ' +
        'from Class where status IN (?, ?)';
    var filter = [status.STUDENT, status.TUTOR];

    mysql.query(statement, filter, callback);
};

exports.getInstance = function (num, callback) {
    var statement = 'select content from Class where num = ?';

    mysql.query(statement, num, function (err, content) {
        if (err) {
            callback(err);
        } else {
            var timeStatement = 'select day, startTime, endTime from Classtime where classNum = ?'

            mysql.query(timeStatement, num, function (err, time) {
                callback(err, {
                    content: content[0].content,
                    time: time
                });
            })
        }
    });
};

exports.create = function (nickname, data, callback) {
    var statement;

    if (data.status === status.STUDENT) {
        data['studentNick'] = nickname;
        data['tutorNick'] = null;
        statement = 'select * from Class where title = ? AND studentNick = ? AND status IN (?, ?)';
    } else if (data.status === status.TUTOR) {
        data['tutorNick'] = nickname;
        data['studentNick'] = null;
        statement = 'select * from Class where title = ? AND tutorNick = ? AND status IN (?, ?)';
    } else {
        callback(400);
        return;
    }

    // Format: 2017-10-27
    data.date = new Date().toISOString().split('T')[0];

    var timeData = data.time;
    delete data.time;

    var filter = [data.title, '', status.STUDENT, status.TUTOR];

    if (duplicateCheck(statement, filter, callback) !== true) {
        var insertStatement = 'insert into Class SET ?';

        // Class에 정보 저장
        mysql.query(insertStatement, data, function (err, result) {
            if (err) {
                callback(err);
            } else {
                for (var prop in timeData) {
                    timeData[prop]['classNum'] = result.insertId;
                    insertStatement = 'insert into Classtime SET ?;';
                    mysql.query(insertStatement, timeData[prop], callback);
                }
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
            if (result.length !== 0) {
                return true;
            } else {
                return false;
            }
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
    if(duplicateCheck(matchStatement, filter) === true) {
        var deleteStatement = 'delete from Class where num = ?';

        mysql.query(deleteStatement, num, callback);
    } else {
        callback(401);
    }
};
