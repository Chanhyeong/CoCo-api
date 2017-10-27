var mysql = require('../../../middleware/database')('mysql');
var mongodb = require('../../../middleware/database')('mongodb');

/**
 * req.body: mode, id, message;
 */

exports.getList = function (req, res) {
    var nickname = req.user.nickname;

    var listQuery = "select * from Class where tutorNick = ? or studentNick = ?";

    mysql.query(listQuery, nickname, nickname, function(err, result){
        if (err) {
            res.status(404).json(err)
        } else {
            if(result.length !== 0) {
                res.status(204).json(null);
            }
            else {
                res.status(200).json(result)
            }
        }
    });
};

exports.getMessageLog = function (req, res) {
    var classNumber = req.params.classNumber;

    mongodb.getMessage(req.body.mode, classNumber, function (result) {
        process.nextTick( function () {
            if(result) {
                res.status(200).send(result.log);
            } else {
                res.status(401).send('Error; Get msg');
            }
        })
    });
};

exports.sendMessage = function (req, res) {
    var classNumer = req.params.classNumer
    var current = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');     // delete the dot and everything after

    var message = {
        id: req.body.id,
        message: req.body.message,
        date: current
    };

    mongodb.insertMessage(req.body.mode, classNumer, message);
    req.app.get('dataHandler').sendChatMsg(classNumer, message);

    res.status(200).send();
};