var mysql = require('../../../middleware/database')('mysql');

var status = {
    'STUDENT': 1,
    'TUTOR': 2,
    'MATCHED': 3,
    'END': 4
};

// function Board () {
//     this.num;
//     this.title;
//     this.content;
//     this.language;
//     this.status;
//     this.tutorNick;
//     this.studentNick;
// }

exports.getList = function (callback) {
    // IFNULL, http://ra2kstar.tistory.com/75
    var statement = 'select title, content, language, IFNULL(tutorNick, studentNick) AS nickname, status, date ' +
        'from Class where status IN (?, ?)';
    var filter = [status['STUDENT'], status['TUTOR']];

    mysql.query(statement, filter, callback);
};

exports.create = function (data, callback) {
    var statement;

    // Format: 2017-10-27
    data['date'] = new Date().toISOString().split('T')[0];

    if (data.status === status['STUDENT']) {
        data['studentNick'] = data['nickname'];
        data['tutorNick'] = '';
        statement = 'select * from Class where title = ? AND studentNick = ? AND status IN (?, ?)';
    } else if (data.status === status['TUTOR']) {
        data['tutorNick'] = data['nickname'];
        data['studentNick'] = '';
        statement = 'select * from Class where title = ? AND tutorNick = ? AND status IN (?, ?)';
    } else {
        callback(400);
    }

    delete data.nickname;

    var filter = [data.title, data.nickname, data,status, status['STUDENT'], status['TUTOR']]

    if (!duplicateCheck(statement, filter, callback)) {
        var insertStatement = 'insert into Class SET ?';
        mysql.query(insertStatement, data, callback);
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
            if (result) { // 이미 값이 존재할 때
                callback(409);
                return true;
            } else {
                return false;
            }
        }
    });
}

exports.delete = function (num, callback) {
    var statement = 'delete from Class where num = ?';

    mysql.query(statement, num, callback)
};