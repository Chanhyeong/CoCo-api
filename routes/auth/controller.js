var bcrypt = require('bcrypt');
var mysql = require('../../model/mysql.js');
var jwt = require('jsonwebtoken')
var pick = require('lodash/pick')

var SECRET = process.env.JWT || 'coco_token_secret'
var EXPIRES = 60*60; // 1 hour

function signToken(userID) {
    return jwt.sign({ userID: userID }, SECRET, { expiresIn : EXPIRES });
}

// 토큰을 해독한 후, 사용자 ID를 request에 추가합니다.
exports.decodeToken = function() {
    return function (req, res, next) {
        if (req.query && req.query.hasOwnProperty('access_token'))
            req.headers.authorization = 'Bearer' + req.query.access_token

        var token = ''

        if (req.headers.authorization)
            token = req.headers.authorization.split(' ')[1]

        if (token) {
            // 토큰을 해독한 후, 사용자 정보(id)를 request에 추가합니다.
            jwt.verify(token, SECRET, function(err, decoded) {
                if (err)
                    res.status(401).send('사용자 인증에 실패했습니다.')
                else {
                    req.user = decoded
                    next()
                }
            })
        }
        else {
            res.status(403).send('토큰이 필요합니다.')
        }
    }
}


exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        var id = req.user.userID
        var token = signToken(id);
        return res.json({
            access_token: token,
            user: {
                userID: id,
                nickName: req.user.nickName,
                email: req.body.email
            }
        });
    }
    else {
        return res.status(401).send('해당 유저가 없습니다.');
    }
};

exports.logout = function (req, res){
    console.log("logout");
    req.logout();
    res.send('logout');
};

exports.signUp = function(req,res){
    var hash = bcrypt.hashSync(req.body.password, 10);

    var user = {
        userID : req.body.userID,
        password : hash,
        email : req.body.email,
        nickName : req.body.nickName
    };

    var sql = "select * from USER where userID = ?";

    mysql.query(sql, req.body.userID, function(err, result){
        if (err) {
            res.status(404).json({ error: err })
        } else {
            if(result.length !== 0) {
                res.status(401).json({ errors: '해당아이디가 이미 존재합니다' });
            } else {
                sql = "insert into USER SET ?";
                mysql.query(sql, user, function(err, result) {
                    if (err) {
                        console.log('err :' + err);
                    } else {
                        res.status(200).json({ user: user })
                    }
                });
            }
        }
    });

};