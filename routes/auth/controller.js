var bcrypt = require('bcrypt');
var mysql = require('../../middleware/mysql');
var jwtHandler = require('../../middleware/jwt-handler');

exports.signIn = function (req, res) {
    var sql = "select * from USER where userID = ?";
    mysql.query(sql, req.body.userID ,function (err, result){
        if (err) { // DB 에러 발생 시
            console.log('DB err :' + err);
            res.status(500).json({ error: err })
        } else {
            if (result.length === 0) { // DB에 ID가 없을 경우
                res.status(401).send('CHECK_ID');
            } else {
                if (!bcrypt.compareSync(req.body.password, result[0].password)) { // 비밀번호 불일치
                    res.status(401).send('CHECK_PW');
                } else { // 모든게 정상적으로 확인됐을 때
                    var user = {
                        userID: req.user.userID,
                        nickName: result[0].nickName,
                        email: result[0].userEmail
                    };
                    var token = jwtHandler.signToken(user);
                    res.json({
                        access_token: token,
                        user: user
                    });
                }
            }
        }
    });
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
            console.log('DB err :' + err);
            res.status(500).json({ error: err })
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