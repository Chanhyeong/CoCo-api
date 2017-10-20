var mysql = require('../../model/mysql.js');

exports.search = function (req, res) {
    var group, language, keyword = "";

    if (req.query.keyword != ""){
        var str = req.query.keyword.split(" ");

        for (var i=0; i<str.length; i++){
            keyword += str[0] + "*";
        }
        keyword = "select num from Class where match (title, content, language) against ("+keyword+" in boolean mode)"
    }else {
        keyword = "select num from Class"
    }

    // 검색
    switch (req.query.group){
        // 전체 검색
        case 0 : group = "select num from Class";
        // 학생 검색
        case 1 : group += "where Status = 1";
            break;
        // 튜터 검색
        case 2 : group += "where Status = 2";
            break;
    }

    switch (req.query.language){
        // 전체 검색
        case 0 : language = "select num from Class";
        case 1 : language += "language = 'C'";
            break;
        case 2 : language += "language = 'JAVA'";
            break;
        case 3 : language += "language = 'python'";
            break;
    }

    var sql = "select * from Class where num in ("+group+") and num in ("+language+") and num in ("+ keyword + ")";

    mysql.query(sql, function (err, result) {
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