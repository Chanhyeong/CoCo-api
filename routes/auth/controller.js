var bcrypt = require('bcrypt');
var jwtHandler = require('../../middleware/jwt-handler');
var userModel = require('../api/user/model');

exports.signIn = function (req, res) {
    userModel.getPassword(req.body.id, function (passwordResult) {
        if (passwordResult === 500) {
            res.status(500).send();
        } else if (!passwordResult.length) {// DB에 ID가 없을 경우
            res.status(401).send('id');
        } else {
            if (!bcrypt.compareSync(req.body.password, passwordResult[0].password)) { // 비밀번호 불일치
                res.status(401).send('password');
            } else {// 모든게 정상적으로 확인됐을 때
                userModel.getUser(req.body.id, function (userResult) {
                    if (userResult === 500) {
                        res.status(500).send();
                    } else {
                        var token = jwtHandler.signToken(userResult[0]);
                        res.status(200).json({
                            access_token: token,
                            user: user
                        });
                    }
                });
            }
        }
    });
};

exports.signUp = function (req, res) {
    var hash = bcrypt.hashSync(req.body.password, 10);

    var user = {
        id : req.body.id,
        password : hash,
        email : req.body.email,
        nickname : req.body.nickname
    };

    userModel.getUser(req.body.id, function (result) {
        if (result === 500) {
            res.status(500).send();
        } else if (result.length) {
            res.status(409).send('id');
        } else {
            userModel.checkNickname(req.body.nickname, function (checkResult) {
                if (checkResult === 500) {
                    res.status(500).send();
                } else if (checkResult.length) {
                    res.status(409).send('nickname');
                } else {
                    userModel.createUser(user, function (createResult) {
                        if (createResult === 500) {
                            res.status(500).send();
                        } else {
                            res.status(200).send();
                        }
                    });
                }
            })
        }
    });
};