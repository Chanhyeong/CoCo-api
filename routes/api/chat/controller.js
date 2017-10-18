var mysql = require('../../../middleware/mysql');

exports.getList = function (req, res) {
    var nickQuery = 'select nickName from USER where userID = ?';

    var nickName;
    mysql.query(nickQuery, req.user.id)

    var listQuery = "select * from Class where tutorNick = ? or studentNick = ?";

    mysql.query(listQuery, nickName, nickName, function(err, result){
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