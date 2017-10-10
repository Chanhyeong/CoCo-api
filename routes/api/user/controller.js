var mysql = require('../../model/mysql.js');


exports.getUser = function (req, res){
    var userID = req.params.id;

    // 개인 정보
    var sql = "select * from USER where userID = ?";
    mysql.query(sql, userID, function(err, result){
        if (err) {
            res.status(404).json({ error: err })
        } else {
            if(result.length !== 0) {
                res.status(401);
            } else {
                res.status(200).json({ user: result[0] })
            }
        }
    });

    // 내가 tutor 일때
    var sql = "select * from TUTORING where tutorID = ?";

    mysql.query(sql, userID, function(err, result){
        if (err) {
            res.status(404).json({ error: err })
        } else {
            if(result.length !== 0) {
                res.status(401);
            } else {
                res.status(200).json({ user: result })
            }
        }
    });

    // 내가 student 일때
    var sql = "select * from TUTORING where studentID = ?";

    mysql.query(sql, userID, function(err, result){
        if (err) {
            res.status(404).json({ error: err })
        } else {
            if(result.length !== 0) {
                res.status(401);
            } else {
                res.status(200).json({ user: result })
            }
        }
    });
};