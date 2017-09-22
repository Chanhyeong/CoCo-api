var bcrypt = require('bcrypt');
var mysql = require('../../model/mysql.js');


exports.login = function (req, res) {
    if (req.isAuthenticated()) {
        // TODO: user nickname을 리액트로 보내주기
        res.json({success: true, userID: req.user.userID})
    }
    else { res.send(false); }
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
        userEmail : req.body.userEmail,
        nickName : req.body.nickName
    };

    var sql = "select * from USER where userID = ?";

    mysql.query(sql, req.body.userID, function(err, result){
        if (err) {
            console.log('err:' + err);
        } else{
            if(result.length !== 0){
                res.json({success: false, msg: '해당아이디가 이미 존재합니다'})
            } else {
                sql = "insert into USER SET ?";
                db.query(sql, user, function(err, result){
                    if (err) {
                        console.log('err :' + err);
                    } else {
                        res.json({success:true, msg:'' +
                        '새 계정을 만들었습니다'})
                    }
                });
            }
        }
    });

};