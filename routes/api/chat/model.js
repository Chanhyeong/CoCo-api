var mongodb = require('../../../middleware/database').mongodb.chatDb;
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
    knex.select('writer', 'applicant', {classNum: 'class_number'}, 'class.*')
        .from('chat').whereRaw('chat.num = ' + chatNumber)
        .innerJoin('class', 'class.num', 'chat.class_number')
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
}

exports.getChatInformation =  function (chatNumber, callback) {
    getChatInformation(chatNumber,callback);
};

exports.updateStatus = function (classNum, applicant, callback) {
    knex.schema.raw('update class ' +
        'set tutor_nickname = if(tutor_nickname is null, ?, tutor_nickname), ' +
        'student_nickname = if(student_nickname is null, ?, student_nickname), status = 3 ' +
        'where num = ?', [applicant, applicant, classNum])
        .catch(function (err) {
            console.log(knex.schema.raw('update class' +
                'set tutor_nickname = if(tutor_nickname is null, ?, tutor_nickname), ' +
                'student_nickname = if(student_nickname is null, ?, student_nickname), status = 3 ' +
                'where num = ?', [applicant, applicant, classNum]).toString());
            console.log(err);
            callback(500);
        }).then(callback);
};

// mode: 'matching' (매칭 중일 때의 채팅) or 'class' (에디터 접속 후 채팅)
exports.getMessage = function (mode, userNickname, chatNumber, callback) {
    var opponentNickname, isWriter;

    getChatInformation(chatNumber, function (result) {
        var classData = result[0];

        if (classData.writer === userNickname) {
            opponentNickname = classData.applicant;
            isWriter = true;
        } else {
            opponentNickname = classData.writer;
            isWriter = false;
        }

        mongodb(function (db) {
            db.collection(mode).findOne( { _id : chatNumber }, function (err, chatResult) {
                if (err) {
                    console.log(err);
                    callback(500);
                } else {
                    callback(null, [{
                        log: chatResult.log,
                        nickname: opponentNickname,
                        status: classData.status,
                        mode: 'matching',
                        isWriter: isWriter,
                        classNum: classData.classNum
                    }]);
                }
            });

            db.close();
        });
    });
};

// 기존 Document에 메시지 추가
exports.insertMessage = function (mode, chatNumber, message, callback) {
    mongodb(function (db) {
        db.collection(mode).update( { _id: chatNumber }, {
            $push: { log: message }
        }, function (err) {
            if (err) {
                console.log(err);
                callback(500);
            } else {
                callback();
            }
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
            _id: id[0],
            log: []
        };

        mongodb(function (db) {
            db.collection(mode).insert(form, function (err) {
                if (err) {
                    console.log(err);
                    callback(500);
                } else {
                    callback();
                }
            });
        });
    });
};

exports.deleteByClassNumber = function (classNum, callback) {
    knex.select('num').from('chat').where('class_number', classNum)
        .then(function (result) {
            for (var index in result) {
                deleteByChatNumber(result[index], function (status) {
                    if (status) {
                        callback(500);
                    }
                })
            }
            callback();
        })
};

exports.deleteOne = function (chatNumber, callback) {
    deleteByChatNumber(chatNumber, callback);
};

function deleteByChatNumber (chatNumber, callback) {
    mongodb(function (db) {
        db.collection('matching').remove({_id: chatNumber}, function (err) {
            if (err) {
                console.log(err);
                callback(500);
            }
        });
    });
}

exports.getRequestInformation = function (nickname, callback) {
    knex.select('chat.*', 'chat.class_number as classNum', 'class.title', 'class.language')
        .from('chat').where('writer', nickname).innerJoin('class', function () {
        this.on('class.num', 'chat.class_number')
            .andOn(function () {
                this.on('class.status', '=', 1)
                    .orOn('class.status', '=', 2)
            })
    }).catch(function (err) {
        console.log(err);
        callback(500);
    }).then(function (writerResult) {
        knex.select('chat.*', 'chat.class_number as classNum', 'class.title', 'class.language')
            .from('chat').where('applicant', nickname).innerJoin('class', function () {
            this.on('class.num', 'chat.class_number')
                .andOn(function () {
                    this.on('class.status', '=', 1)
                        .orOn('class.status', '=', 2)
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