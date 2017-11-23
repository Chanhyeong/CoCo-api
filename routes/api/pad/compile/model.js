var mysql = require('../../../../middleware/database')('mysql');

exports.getLanguage = function (num, callback){
    var statement = 'select language from Class where num = ?';
    var filter = num;

    mysql.query(statement, filter, callback);
};