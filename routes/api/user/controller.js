var mysql = require('../../../middleware/database').mysql;
var model = require('./model');
var boardModel = require('../board/model');
var chatModel = require('../chat/model');

// Unused
exports.getUser = function (req, res) {
    model.getUser(req.user.id, function (result) {
        if (result === 500) {
            res.status(500).send();
        } else {
            res.status(200).send({
                user : result[0]
            });
        }
    });
};

// getClass, getWriter, getApplicant 통합
exports.getUserInformation = function (req, res) {
    boardModel.getClassesByNickname(req.user.nickname, function (classesResult) {
        if (classesResult === 500) {
            res.status(500).send();
        } else {
            chatModel.getRequestInformation(req.user.nickname, function (requestResult) {
                if (requestResult === 500) {
                    res.status(500).send();
                } else {
                    res.status(200).json({
                        list: {
                            classes: classesResult,
                            requests: requestResult
                        }
                    })
                }
            })
        }
    });
};

// 튜터 등록
exports.registerTutor = function (req, res) {
    var data = req.body;
    data['id'] = req.user.id;

    model.registerTutor(data, function (result) {
        if (result === 500) {
            res.status(500).send();
        } else {
            res.status(200).send()
        }
    });
};

exports.getTutorInformationByNickname = function (req, res) {
    model.getTutorInformationByNickname(req.params.nickname, function (result) {
        if (result === 500) {
            res.status(500).send({error: err})
        } else if (!result.length) {
            res.status(404).send("튜터 정보가 없습니다.");
        } else {
            res.status(200).send({
                tutor: result[0]
            });
        }
    });
};

// 튜터 정보 얻어오기
exports.getTutorInformationById = function(req, res) {
    model.getTutorInformationById(req.params.id, function (result) {
        if (result === 500) {
            res.status(500).send({error: err})
        } else if (!result.length) {
            res.status(404).send("튜터 정보가 없습니다.");
        } else {
            res.status(200).send({
                tutor: result[0]
            });
        }
    });
};
