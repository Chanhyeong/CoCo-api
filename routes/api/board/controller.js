var mysql = require('../../../middleware/mysql');

exports.create = function (req, res) {
    var data = req.body;
    data['Status'] = 'NOT_MATCHED';
    data['Student'] = '';

    var statement = 'select * from TUTORING where Title = ? AND tutorNick = ? AND Status = \'NOT_MATCHED\'';
    mysql.query(statement, req.body.Title, req.body.nickName, function (err, result) {
        if (err) { console.log('err: ', err); }
        else{
            if(result.length !== 0){
                res.status(409).send('동일 제목으로 생성된 게시글이 이미 존재합니다.');
            } else {
                statement = 'insert into TUTORING SET ?';
                mysql.query(statement, data, function (err, result) {
                    if (err) { console.log ('err: ', err); }
                    else { res.send(200); }
                })
            }
        }
    });
 };

exports.delete = function (req, res) {
    console.log(req.params.num)
    var statement = 'alter table TUTORING where tNum = ?';
    mysql.query(statement, req.param)
}