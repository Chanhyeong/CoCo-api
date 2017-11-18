var model = require('./model');
var fs = require('fs');
const exec = require('child_process').exec;

// 해당 유저에 대한 전체 리스트 가져오기
exports.getMessages = function (req, res) {
    model.getMessages(req.user.nickname, function (err, result) {
        if (err) {
            console.log('DB select error', err);
            res.status(500).send('Err: DB select error');
        } else {
            process.nextTick(function() {
                if (!result) {
                    res.status(204).json({list: null});
                } else {
                    res.status(200).json({list: result});
                }
            });
        }
    });
};

// 채팅방번호에 맞는 채팅 로그
exports.getMessage = function (req, res) {
    var chatNumber = parseInt(req.params.chatNumber);

    model.getMessage('matching', chatNumber, function (err, result) {
        // mongodb에서 검색된 내용이 바로 채워지지 않아서 nextTick 추가
        process.nextTick( function () {
            if (err) {
                console.log('DB insert error, mongo');
                res.status(500).send('Error: DB Find Error');
            } else {
                if(!result) {
                    res.status(409).send('wrong chat number');
                } else {
                    res.status(200).send({
                        mode: 'matching',
                        log: result.log
                    });
                }
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
        nickname: req.user.nickname,
        message: req.body.message,
        date: time
    };

    model.insertMessage(req.body.mode, chatNumber, message, function (err) {
        if (err) {
            console.log('DB insert error, mongo');
            res.status(500).send('Err: DB insert Error');
        }

        req.app.get('dataHandler').sendChatMsg(chatNumber, message);
        res.status(200).send();
    });
};

// TODO 1: 매칭이 되고 + 끝난 클래스에 대한 정보를 남겨두려면 현재 디비 구조로는 안되는데.
// TODO 2: 매칭이 되면 새로운 row를 추가하여 터미널 번호를 새로 부여하는 방식이 나을 것 같음
exports.handleMatch = function (req, res) {
    switch (req.body.mode) {

        case 'on':
            model.getChatInfo(req.body.chatNum, function (err, result){
                if(err){
                    console.log('DB Update error, mysql');
                    res.status(500).send('Err: get ChatInfo Error');
                }

                model.Match(result[0].classNum, result[0].applicant, function (err){
                    if(err){
                        console.log('DB Update error, mysql');
                        res.status(500).send('Err: Match Error');
                    }
                });

                process.umask(0);
                fs.mkdir('/root/store/' + result[0].classNum, 0777, function (err){
                    if (err){
                        console.log('file system error, mkdir');
                        res.status(500).send('Err: server error');
                    }
                });

                exec('docker run -d -p '+ result[0].classNum +':22 -h Terminal --cpu-quota=25000 --name '+
                    result[0].classNum +' -v /root/store/'+ result[0].classNum +':/home/coco coco:0.3',function (err, stdout){
                    if (err) {
                        console.log('exec error : docker run error');
                        res.status(500).send('Err: docker run error');
                    }
                    else{
                        exec('docker stop '+ result[0].classNum, function (err){
                            if (err) {
                                console.log('exec error : docker stop error');
                                res.status(500).send('Err: docker stop error');
                            }
                        });
                    }
                });

                res.status(200)

            });
            break;

        case 'off':
            model.delete(req.body.chatNum, function (err) {
                if (err) {
                    console.log('DB delete error, mongo');
                    res.status(500).send('Err: DB delete Error');
                } else {
                    res.status(200).send();
                }
            });
            break;
    }
};
