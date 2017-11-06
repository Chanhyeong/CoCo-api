var mysql = require('../../../middleware/database')('mysql');
var model = require('./model');
var chatModel = require('../chat/model');

exports.getList = function (req, res) {
    model.getList( function (err, result) {
        if (err) {
            console.log('DB select err: ', err);
            res.status(500).send('Err: DB select Error');
        } else{
            res.status(200).send({
                list: result
            });
        }
    });
};

exports.getOne = function (req, res) {
    model.getInstance(req.params.num, function (err, result) {
        if (err) {
            console.log('DB select err: ', err);
            res.status(500).send('Err: DB select Error');
        } else{
            res.status(200).send({
                class: result
            });
        }
    });
};

exports.create = function (req, res) {
    var data = req.body;

    model.create(data, function (err) {
        if (Number.isInteger(err)) {
            switch (err) {
                case 400: res.status(400).send('Check the status number'); break;
                case 409: res.status(409).send('동일 제목한 제목으로 이미 게시글을 생성하였습니다.');
            }
        } else if (err) {
            console.log('DB select err: ', err);
            res.status(500).send('Err: DB select Error');
        } else {
            res.status(200).send();
        }
    })
};

// 게시된 클래스에 매칭 신청 시 채팅방 생성
exports.request = function (req, res) {
    chatModel.create(function (err) {

    });
};

//TODO: 글 수정 api
exports.modify = function (req, res) {

};

exports.delete = function (req, res) {
    model.delete(req.params.num, function (err) {
        if (err) {
            console.log ('DB delete err: ', err);
            res.status(500).send('Err: DB delete Error');
        } else {
            res.status(200).send();
        }
    });
};