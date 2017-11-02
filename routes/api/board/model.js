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
    var statement = 'select title, content, language, tutorNick ' +
        'from Class where status IN (?, ?)';

    mysql.query(statement, model.getConst('STUDENT'), model.getConst('TUTOR'), callback);
};

exports.create = function (data, callback) {
    // Format: 2017-10-27
    data['date'] = new Date().toISOString().split('T')[0];

    if (req.body.status === status['STUDENT']) {
        data['studentNick'] = data['nickname'];
        data['tutorNick'] = '';
        statement = 'select * from Class where title = ? AND studentNick = ? AND status IN (?, ?)';
    } else if (req.body.status === status['TUTOR']) {
        data['tutorNick'] = data['nickname'];
        data['studentNick'] = '';
        statement = 'select * from Class where title = ? AND tutorNick = ? AND status IN (?, ?)';
    } else {
        callback(400);
    }

    delete data.nickname;

    if (!duplicateCheck(data, callback)) {
        var insertStatement = 'insert into Class SET ?';
        mysql.query(insertStatement, data, callback);
    }

};

// 중복 체크. return: 중복이면 true 없으면 false
function duplicateCheck (data, callback) {
    var statement;

    mysql.query(statement, data.title, data.nickname, data,status, status['STUDENT'], status['TUTOR'],
        function (err, result) {
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

    // TODO: function (err) {}를 아예 callback으로 대체 했는데 작동하는지
    mysql.query(statement, num, callback)
};

exports.getConst = function (mode) {
    return status[mode];
};