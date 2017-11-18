var mysql = require('mysql');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('../config');

var mysqlDb = mysql.createPool(config.mysqlConfig);
mysqlDb.getConnection(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

var MongoDb = {}

MongoDb.chatDb = function (callback) {
    MongoClient.connect(config.mongoUrl.chat, function (err, db) {
        assert.equal(err, null);
        callback(db);
    });
};

MongoDb.directoryDb = function (callback) {
    MongoClient.connect(config.mongoUrl.chat, function (err, db) {
        assert.equal(err, null);
        callback(db);
    });
};

module.exports = function (name) {
    switch (name) {
        case 'mysql': return mysqlDb; break;
        case 'mongodb': return MongoDb;
    }
};
