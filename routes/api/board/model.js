var knex = require('../../../middleware/database').knex;

var status = {
    'STUDENT': 1,
    'TUTOR': 2,
    'MATCHED': 3,
    'END': 4
};

exports.getClasses = function (callback) {
    var filter = [status.STUDENT, status.TUTOR];

    knex.schema.raw('select num, title, language, IFNULL(tutor_nickname, student_nickname) AS nickname, status, date ' +
        'from class where status IN (?, ?)', filter)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};

exports.getLanguage = function (classNum, callback) {
    knex.select('language').from('class').where('num', classNum)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};

exports.getClass = function (classNum, callback) {
    knex.select('content', {tutorNick: 'tutor_nickname'}, {studentNick: 'student_nickname'})
        .from('class').where('num', classNum)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(function (classResult) {
        knex.select('day', {startTime: 'start_time'}, {endTime: 'end_time'})
            .from('classtime').where('class_number', classNum)
            .catch(function (err) {
                console.log(err);
                callback(500);
            }).then(function (timeResult) {
            callback({
                content: classResult[0].content,
                time: timeResult,
                tutorNick: classResult[0].tutorNick,
                studentNick: classResult[0].studentNick
            })
        })
    });
};

exports.getClassesByNickname = function (nickname, callback) {
    var filter = [nickname, nickname, status.MATCHED];

    knex.schema.raw('select *, tutor_nickname as tutorNick, student_nickname as studentNick' +
        ' from class where (student_nickname = ? or tutor_nickname = ?) and status = ?', filter)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(function (matchedList) {
        filter = [nickname, nickname];
        knex.schema.raw('select *, tutor_nickname as tutorNick, student_nickname as studentNick' +
            ' from class where (student_nickname = ? or tutor_nickname = ?)', filter)
            .catch(function (err) {
                console.log(err);
                callback(500);
            }).then(function (allList) {
            callback({
                matchList: matchedList[0],
                myList: allList[0]
            })
        })
    });
};

exports.create = function (nickname, data, callback) {
    var statement;

    if (data.status === status.STUDENT) {
        data['studentNick'] = nickname;
        data['tutorNick'] = null;
        statement = 'select * from class where title = ? AND student_nickname = ? AND status IN (?, ?)';
    } else if (data.status === status.TUTOR) {
        data['tutorNick'] = nickname;
        data['studentNick'] = null;
        statement = 'select * from class where title = ? AND tutor_nickname = ? AND status IN (?, ?)';
    } else {
        callback(400);
        return;
    }

    data = JSON.parse(JSON.stringify(data).split('"tutorNick":').join('"tutor_nickname":'));
    data = JSON.parse(JSON.stringify(data).split('"studentNick":').join('"student_nickname":'));

    // Format: 2017-10-27
    data.date = new Date().toISOString().split('T')[0];

    var timeData = data.time;
    delete data.time;

    var filter = [data.title, '', status.STUDENT, status.TUTOR];

    knex.schema.raw(statement, filter)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(function(result) {
        if (result[0].length !== 0) {
            callback(409);
        } else {
            knex.into('class').insert(data)
                .catch(function (err) {
                    console.log(err);
                    callback(500);
                }).then(function (id) {
                callback(timeInsert(id, timeData));
            });
        }
    });
};

// 시간 데이터 추가, 에러면 err, 아니면 null
function timeInsert (classNum, data) {
    for (var prop in data) {
        data[prop] = JSON.parse(JSON.stringify(data[prop]).split('"startTime":').join('"start_time":'));
        data[prop] = JSON.parse(JSON.stringify(data[prop]).split('"endTime":').join('"end_time":'));
        data[prop]['class_number'] = classNum;
        knex.into('classtime').insert(data[prop])
            .catch(function (err) {
                console.log(err);
                return 500;
            }).then()
    }
}

exports.modifyClass = function (classNum, classData, timeData) {
    classData = JSON.parse(JSON.stringify(classData).split('"tutorNick":').join('"tutor_nickname":'));
    classData = JSON.parse(JSON.stringify(classData).split('"studentNick":').join('"student_nickname":'));

    knex('class').update(classData).where('num', classNum)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(function () {
        knex.del().from('classtime').where('class_number', classNum)
            .catch(function (err) {
                console.log(err);
                callback(500);
            }).then(callback(timeInsert(classNum, timeData)));
    })
};

exports.delete = function (classNum, callback) {
    knex.del().from('class').where('num', classNum)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};
