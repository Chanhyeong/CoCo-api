var mysql = require('../../../middleware/mysql');

exports.getList = function (req, res) {
    var nickQuery = 'select nickName from User where id = ?';

    // TODO: 아이디로 닉네임 찾는 쿼리 진행
    var nickname;
    mysql.query(nickQuery, req.user.id)

    var listQuery = "select * from Class where tutorNick = ? or studentNick = ?";

    mysql.query(listQuery, nickname, nickname, function(err, result){
        if (err) {
            res.status(404).json({ error: err })
        } else {
            if(result.length !== 0) {
                res.status(204).json({ list: null });
            }
            else {
                res.status(200).json({ list: user })
            }
        }
    });
};