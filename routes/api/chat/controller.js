var mysql = require('../../../middleware/database')('mysql');
var mongodb = require('../../../middleware/database')('mongodb');
var model = require('../board/model');

exports.getList = function (req, res) {
    var nickname = req.user.nickname;

    var statement = "select c.num, c.title, c.tutorNick, c.studentNick, ch.num as chatNum " +
        "from Class AS c inner join Chat AS ch ON c.num = ch.classNum " +
        "where tutorNick = ? OR studentNick = ?";

    mysql.query(statement, nickname, nickname, function(err, result){
        if (err) {
            res.status(404).json(err)
        } else {
            if(result.length !== 0) {
                res.status(204).json({ list: null });
            } else {
                res.status(200).json({ list: result });
            }
        }
    });
};

/**
 * req.body: id, message;
 */

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

exports.sendMessage = function (req, res) {
    var chatNumber = parseInt(req.params.chatNumber);

    // Format: 2017-10-27 17:19:33
    var current = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');     // delete the dot and everything after

    var message = {
        id: req.body.id,
        message: req.body.message,
        date: current
    };

    mongodb.insertMessage(req.params.mode, chatNumber, message);
    req.app.get('dataHandler').sendChatMsg(chatNumber, message);

    res.status(200).send();
};

// TODO: 채팅방 삭제 구현
exports.expireChat = function () {

};