var mysql = require('mysql');

var db = mysql.createConnection({
    host:'external.sopad.ml',
    port: 3306,
    user: 'coco',
    password: 'whdtjf123@',
    database:'coco'
});

db.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});


module.exports = db;