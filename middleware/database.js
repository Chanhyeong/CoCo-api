var mysql = require('mysql');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var mysqlOptions = {
    host:'external.cocotutor.ml',
    port: 3306,
    user: 'coco',
    password: 'whdtjf123@',
    database:'coco'
};

var mongoUrl = 'mongodb://external.cocotutor.ml:27017/chat';

var mysqlDb = mysql.createConnection(mysqlOptions);
mysqlDb.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

function mongoDb (callback) {
    MongoClient.connect(mongoUrl, function (err, db) {
        assert.equal(err, null);
        callback(db);
    });
}

module.exports = function (name) {
    switch (name) {
        case 'mysql': return mysqlDb; break;
        case 'mongodb': return mongoDb;
    }
};