var mysql = require('../../../../middleware/database').mysql;

exports.search = function (req, res) {
    var group, language, keyword = "";

    if (req.query.keyword !== ""){
        var str = req.query.keyword.split(" ");
        console.log(str);
        for (var i=0; i<str.length; i++){
            keyword += str[i] + "*";
        }
        keyword = "select num from Class where match (title, content, language) against ('"+keyword+"' in boolean mode)"
    } else {
        keyword = "select num from Class"
    }

    // 검색s
    group = "select num from Class, User ";
    switch (req.query.group) {
        // 전체 검색
        case '0' : group += "where status = 1 or status = 2";
            break;
        // 학생 검색
        case '1' : group += "where status = 1";
            break;
        // 튜터 검색
        case '2' : group += "where status = 2 and tutor = 1";
            break;
    }

    language = "select num from Class ";
    switch (req.query.language){
        case '0' : //all
            break;
        case '1' : language += "where language = 'C'";
            break;
        case '2' : language += "where language = 'C++'";
            break;
        case '3' : language += "where language = 'JAVA'";
            break;
        case '4' : language += "where language = 'python'";
            break;
    }

    var sql = "select num, title, content, language, IFNULL(tutorNick, studentNick) AS nickname, status, date "+
              "from Class where num in ("+group+") and num in ("+language+") and num in ("+ keyword + ");";

    mysql.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({error: err})
        } else {
            res.status(200).send({
                list: result
            });
        }
    });

};