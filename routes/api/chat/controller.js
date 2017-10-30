var mysql = require('../../../middleware/database')('mysql');
var mongodb = require('../../../middleware/database')('mongodb');
var model = require('../board/model')

exports.getList = function (req, res) {
    var nickname = req.user.nickname;

    var statement = "select num, title, tutorNick, studentNick " +
        "from Class where tutorNick = ? OR studentNick = ? AND status - ?";

    mysql.query(statement, nickname, nickname, model.getConst('ON'), function(err, result){
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
    var classNumber = parseInt(req.params.classNumber);

    mongodb.getMessage(req.params.mode, classNumber, function (result) {
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
    var classNumber = parseInt(req.params.classNumber);

    // Format: 2017-10-27 17:19:33
    var current = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');     // delete the dot and everything after

    var message = {
        id: req.body.id,
        message: req.body.message,
        date: current
    };

    mongodb.insertMessage(req.params.mode, classNumer, message);
    req.app.get('dataHandler').sendChatMsg(classNumer, message);

    res.status(200).send();
};