var model = require('./model');
var chatModel = require('../chat/model');
var exec = require('child_process').exec;

exports.getClasses = function (req, res) {
    model.getClasses( function (err, result) {
        if (err) {
            console.log('DB select err: ', err);
            res.status(500).send('Err: DB select Error');
        } else {
            res.status(200).json({
                list: result
            });
        }
    });
};

exports.getClass = function (req, res) {
    model.getInstance(req.params.num, function (err, result) {
        if (err) {
            console.log('DB select err: ', err);
            res.status(500).send('Err: DB select Error');
        } else {
            res.status(200).json({
                list: result
            });
        }
    });
};

exports.create = function (req, res) {
    var data = req.body;

    model.create(req.user.nickname, data, function (err) {
        if (Number.isInteger(err)) {
            switch (err) {
                case 400: res.status(400).send('Check the \'status\' number'); break;
                case 409: res.status(409).send('동일 제목한 제목으로 이미 게시글을 생성하였습니다.');
            }
        } else if (err) {
            console.log('DB err: ', err);
            res.status(500).send('Err: DB select Error');
        } else {
            res.status(200).send();
        }
    })
};

// 게시된 클래스에 매칭 신청 시 채팅방 생성
exports.request = function (req, res) {
    var data = req.body;
    data['applicant'] = req.user.nickname;

    var time = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');     // delete the dot and everything after

    chatModel.create('matching', data, time, function (err) {
        if (err) {
            console.log('DB insert err: ', err);
            res.status(500).send('Err: DB insert Error');
        } else {
            res.status(200).send();
        }
    });
};

exports.modify = function (req, res) {
    var classData = req.body;
    var timeData = classData.time;

    delete classData.time;

    var modelStatus = model.modifyClass(req.params.num, classData, timeData);

    if (modelStatus) {
        console.log('DB update error', modelStatus);
        res.status(500).send('DB update Error');
    } else {
        res.status(200).send();
    }
};

// TODO: store를 coco-api 하위 폴더로 만들기
exports.delete = function (req, res) {
    model.delete(req.params.num, function (err) {
        if (err) {
            console.log ('DB delete err: ', err);
            res.status(500).send('Err: DB delete Error');
        } else {
            chatModel.deleteByClassNumber(req.params.num, function (err) {
                if (err) {
                    res.status(500).send();
                } else {
                    exec('docker stop ' + req.params.num + '&&docker rm ' + req.params.num
                        + '&&rm -rf /root/store/' + req.params.num, function (err) {
                        if (err) {
                            console.log ('Docker remove err: ', err);
                            res.status(500).send();
                        } else {
                            res.status(200).send();
                        }
                    });
                }
            });
        }
    });
};
