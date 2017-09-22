var bcrypt = require('bcrypt');
var mysql = require('../../model/mysql.js');


exports.login = function (req, res) {
    if (req.isAuthenticated()) {
        return res.json({userID: req.user.userID, nickName: req.user.nickName});
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
        userEmail : req.body.userEmail,
        nickName : req.body.nickName
    };

    var sql = "select * from USER where userID = ?";

    mysql.query(sql, req.body.userID, function(err, result){
        if (err) {
            console.log('err:' + err);
        } else{
            if(result.length !== 0){
                res.status(401).send('해당아이디가 이미 존재합니다');
            } else {
                sql = "insert into USER SET ?";
                mysql.query(sql, user, function(err, result){
                    if (err) {
                        console.log('err :' + err);
                    } else {
                        res.send(200);
                    }
                });
            }
        }
    });

};