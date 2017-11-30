var mysql = require('../../../middleware/database')('mysql');
var knex = require('../../../middleware/database')('knex');

var status = {
    'STUDENT': 1,
    'TUTOR': 2,
    'MATCHED': 3,
    'END': 4
};

exports.getClasses = function (callback) {
    // IFNULL, http://ra2kstar.tistory.com/75
    var statement = 'select num, title, language, IFNULL(tutorNick, studentNick) AS nickname, status, date ' +
        'from Class where status IN (?, ?)';
    var filter = [status.STUDENT, status.TUTOR];

    mysql.query(statement, filter, callback);
};

exports.getStatus = function (classNum, callback) {
    return knex('Class').where({
        num: classNum
    }).select('status')
        .then(callback);
};

exports.getLanguage = function (num, callback){
    var statement = 'select language from Class where num = ?';

    mysql.query(statement, num, callback);
};

exports.getInstance = function (num, callback) {
    var statement = 'select content, tutorNick, studentNick from Class where num = ?';

    mysql.query(statement, num, function (err, content) {
        if (err) {
            callback(err);
        } else {
            var timeStatement = 'select day, startTime, endTime from Classtime where classNum = ?';

            mysql.query(timeStatement, num, function (err, time) {
                if(content) {
                    callback(err, {
                        content: content[0].content,
                        time: time,
                        tutorNick: content[0].tutorNick,
                        studentNick: content[0].studentNick
                    });
                } else callback(err, null)
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
                callback(timeInsert(result.insertId, timeData));
            }
        });
    } else { // 이미 값이 존재할 때
        callback(409);
    }

};

// 시간 데이터 추가, 에러면 err, 아니면 null
function timeInsert (classNumber, data) {
    for (var prop in data) {
        data[prop]['classNum'] = classNumber;
        var insertStatement = 'insert into Classtime SET ?;';
        mysql.query(insertStatement, data[prop], function(err) {
            return err;
        });
    }
}

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

exports.modifyClass = function (classNumber, classData, timeData) {
    var statement = 'update Class set ? where num = ?';
    var filter = [classData, classNumber];

    mysql.query(statement, filter, function (err) {
        if (err) return err;
        else {
            statement = 'delete from Classtime where classNum = ?';
            mysql.query(statement, classNumber, function (err) {
                if (err) return err;
                else timeInsert(classNumber, timeData);
            })
        }
    });
};

exports.delete = function (classNumber, callback) {
    var deleteStatement = 'delete from Class where num = ?';

    mysql.query(deleteStatement, classNumber, callback);

};
