var mysql = require('../../../middleware/database')('mysql');
var mongodb = require('../../../middleware/database')('mongodb');
var model = require('../board/model');

// 해당 유저에 대한 전체 리스트 가져오기
exports.getList = function (req, res) {
    var nickname = req.user.nickname;

    var statement = "select c.num, c.title, c.tutorNick, c.studentNick, ch.num as chatNum " +
        "from Class AS c inner join Chat AS ch ON c.num = ch.classNum " +
        "where tutorNick = ? OR studentNick = ?";

    mysql.query(statement, nickname, nickname, function(err, result){
        if (err) {
            console.log('DB select error', err);
            res.status(500).send('Err: DB select error');
        } else {
            if(result.length !== 0) {
                res.status(204).json({ list: null });
            } else {
                res.status(200).json({ list: result });
            }
        }
    });
};

// 채팅방번호에 맞는 채팅 로그
exports.getMessageLog = function (req, res) {
    var chatNumber = parseInt(req.params.chatNumber);

    mongodb.getMessage(req.params.mode, chatNumber, function (result) {
        process.nextTick( function () {
            if(result) {
                res.status(200).send({ log : result.log });
            } else {
                res.status(401).send('Error; Get msg');
            }
        })
    });
};

// 채팅방번호에 새로운 메시지 라인 추가
exports.sendMessage = function (req, res) {
    var chatNumber = parseInt(req.params.chatNumber);

    // Format: 2017-10-27 17:19:33
    var time = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');     // delete the dot and everything after

    var message = {
        id: req.body.id,
        message: req.body.message,
        date: time
    };

    mongodb.insertMessage(req.params.mode, chatNumber, message, function (err) {
        if (err) {
            console.log('DB insert error, mongo');
            res.status(500).send('Err: DB insert Error');
        }

        req.app.get('dataHandler').sendChatMsg(chatNumber, message);
        res.status(200).send();
    });
};