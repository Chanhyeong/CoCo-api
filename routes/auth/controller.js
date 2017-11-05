var bcrypt = require('bcrypt');
var mysql = require('../../middleware/database')('mysql');
var jwtHandler = require('../../middleware/jwt-handler');

exports.signIn = function (req, res) {
    var sql = "select * from User where id = ?";
    mysql.query(sql, req.body.id ,function (err, result){
        if (err) { // DB 에러 발생 시
            console.log('DB err :' + err);
            res.status(500).json({ error: err });
        } else {
            if (result.length === 0) { // DB에 ID가 없을 경우
                res.status(401).send('CHECK_ID');
            } else {
                if (!bcrypt.compareSync(req.body.password, result[0].password)) { // 비밀번호 불일치
                    res.status(401).send('CHECK_PW');
                } else { // 모든게 정상적으로 확인됐을 때
                    var user = {
                        id: result[0].id,
                        nickname: result[0].nickname,
                        email: result[0].email,
                        tutor: result[0].tutor
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
        id : req.body.id,
        password : hash,
        email : req.body.email,
        nickname : req.body.nickname
    };

    var sql = "select * from User where id = ?";

    mysql.query(sql, req.body.id, function(err, result){
        if (err) {
            console.log('DB select err :' + err);
            res.status(500).json({ error: err });
        } else {
            if(result.length !== 0) {
                res.status(401).json({ errors: '해당아이디가 이미 존재합니다' });
            } else {
                sql = "insert into User SET ?";
                mysql.query(sql, user, function(err) {
                    if (err) {
                        console.log('DB insert err :' + err);
                        res.status(500).json({ error: err });
                    } else {
                        res.status(200).json({ user: user })
                    }
                });
            }
        }
    });
};