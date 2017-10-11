var mysql = require('../../model/mysql.js');


exports.search = function (req, res) {
    var keyword = req.param.keyword + "*";
    var category = req.param.category;
    var sql;

    // 검색
    switch (category){
        case "all" : sql = "select * from TUTORING " +
            "               where match (Title, Content, Language) against (? in boolean mode);";
            break;
        case "Title" : sql = "select * from TUTORING" +
            "               where match (Title) against (? in boolean mode);";
            break;
        case "Content" : sql = "select * from TUTORING" +
            "               where match (Content) against (? in boolean mode);";
            break;
        case "Language" : sql = "select * from TUTORING" +
            "               where match (Language) against (? in boolean mode);";
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