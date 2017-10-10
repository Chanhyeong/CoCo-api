var mysql = require('../../model/mysql.js');


exports.search = function (req, res) {
    var keyword = "%"+ req.param.keyword + "%";
    var category = req.param.category;
    var sql;

    // 검색
    switch (category){
        case "all" : sql = "select * from TUTORING " +
            "               where Title like ? " +
            "               or Content like ?" +
            "               or Language like ?";
            break;
        case "Title" : sql = "select * from TUTORING" +
            "               where Title like ? ";
            break;
        case "Content" : sql = "select * from TUTORING" +
            "               where Content like ? ";
    }

    mysql.query(sql, keyword, function (err, result) {
        if (err) {
            res.status(404).json({error: err})
        } else {
            if (result.length !== 0) {
                res.status(401).json("해당 검색 내용이 없습니다.");
            } else {
                res.status(200).json({user: result})
            }
        }
    });
};