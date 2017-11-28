var mysql = require('../../../middleware/database')('mysql');

exports.getUser = function (req, res) {
    var filter = req.params.id;

    // 개인 정보
    var sql = "select id, email, nickname, tutor from User where id = ?";

    mysql.query(sql, filter, function (err, result) {
        if (err) {
            res.status(500).send({error: err})
        } else {
            res.status(200).send({
                user : result[0]
            });
        }
    });
};

exports.getClass = function (req, res) {
    var userNick = req.params.nickname;

    var status = {
        'STUDENT': 1,
        'TUTOR': 2,
        'MATCHED': 3,
        'END': 4
    };

    // 내가 수강중인 목록
    var sql = "select * from Class where (studentNick = ? or tutorNick = ?) and status = ?";
    var filter = [userNick, userNick, status.MATCHED];

    mysql.query(sql, filter, function (err, result1) {
        if (err) {
            res.status(500).json({error: err})
        } else {
            sql = "select * from Class where (studentNick = ? or tutorNick = ?) and (status = ? or status = ?)";
            filter = [userNick, userNick, status.STUDENT, status.TUTOR];
            mysql.query(sql, filter, function (err, result2){
                if (err) {
                    res.status(500).json({error: err})
                } else {
                    res.status(200).send({
                        matchList : result1,
                        myList : result2
                    });
                }
            });

        }
    });

};

exports.getWriter = function(req, res) {
    var filter = req.params.nickname;

    // 신청온 목록
    var sql = "select ch.num, ch.writer, ch.applicant, c.title, c.language, ch.classNum " +
            "from Chat as ch, Class as c " +
            "where ch.classNum = c.num and writer = ? and (c.status = 1 or c.status = 2)";
    mysql.query(sql, filter, function (err, result) {
        if (err) {
            res.status(500).json({error: err})
        } else {
            res.status(200).send({
                list : result
            });
        }
    });
};

exports.getApplicant = function(req, res){
    var filter = req.params.nickname;

    // 신청한 목록
    var sql = "select ch.num, ch.writer, ch.applicant, c.title, c.language, ch.classNum " +
            "from Chat as ch, Class as c " +
            "where ch.classNum = c.num and applicant = ? and (c.status = 1 or c.status = 2)";
    mysql.query(sql, filter, function(err, result){
        if (err) {
            res.status(500).json({ error: err })
        } else {
            res.status(200).send({
                list : result
                });
        }
    });
};

// 튜터 등록
exports.regist = function(req, res){
    var info = {
        'id' : req.body.id,
        'degree' : req.body.degree,
        'intro' : req.body.intro,
        'github' : req.body.github,
        'career' : req.body.career,
        'language' : req.body.language
    };

    var sql = "insert into Tutor values (?, ?, ?, ?, ?, ?)";
    var filter = [info.id, info.degree, info.intro, info.github, info.career, info.language];

    mysql.query(sql, filter , function(err, result){
        if (err) {
            res.status(500).send({error: err})
        } else {
            res.status(200).send({
                list : result
            });
        }
    });
};

exports.getTutor = function(req, res){
    var filter = req.params.nickname;

    var sql = "select degree, intro, github, career, t.language from Tutor as t, User as u where t.id = u.id and nickname = ?";
    mysql.query(sql, filter, function (err, result) {
        if (err) {
            res.status(500).send({error: err})
        } else {
            if(!result.length) {
                res.status(404).send("튜터 정보가 없습니다.");
            } else {
                res.status(200).send({
                    tutor : result[0]
                });
            }
        }
    });
};

// 튜터 정보 얻어오기
exports.TutorInfo = function(req, res){
    var filter = req.params.id;

    var sql = "select degree, intro, github, career, language from Tutor where id = ?";
    mysql.query(sql, filter, function (err, result) {
        if (err) {
            res.status(500).send({error: err})
        } else {
            if(!result.length) {
                res.status(404).send("튜터 정보가 없습니다.");
            } else {
                res.status(200).send({
                    tutor : result[0]
                });
            }
        }
    });
};