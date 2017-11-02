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

function MongoDB() {}

// 특정 Document의 message 반환
// result 값이 router로 전달되지 않아서 callback으로 설계
// mode: 'matching' (매칭 중일 때의 채팅) or 'class' (에디터 접속 후 채팅)
MongoDB.getMessage = function (mode, chatNumber, callback) {
    MongoClient.connect(mongoUrl, function (err, db) {
        assert.equal(err, null);

        db.collection(mode).findOne( { _id : chatNumber }, function (err, result) {
            assert.equal(err, null);
            console.log(result);
            callback(result);
        });

        db.close();
    });
};

// 기존 Document에 메시지 추가
MongoDB.insertMessage = function (mode, chatNumber, message, callback) {
    MongoClient.connect(mongoUrl, function (err, db) {
        assert.equal(err, null);

        db.collection(mode).update( { _id: chatNumber }, {
            $push: { log: message }
        }, function (err){
            if (err) {
                callback(err)
            } else {
                callback(null);
            }
        });
    });
};

// 새로운 Document 생성
MongoDB.createChat = function (mode, chatNumber, form, callback) {
    MongoClient.connect(mongoUrl, function (err, db) {
        assert.equal(err, null);

        db.collection(mode).insert(form, function (err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    });
};

module.exports = function (name) {
    switch (name) {
        case 'mysql': return mysqlDb; break;
        case 'mongodb': return MongoDB;
    }
};