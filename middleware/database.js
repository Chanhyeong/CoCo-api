var mysql = require('mysql');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('../config');

var mysqlDb = mysql.createConnection(config.mysqlConfig);
mysqlDb.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

function MongoDb () {}

MongoDb.prototype.chatDb = function (callback) {
    MongoClient.connect(config.mongoUrl.chat, function (err, db) {
        assert.equal(err, null);
        callback(db);
    });
};

MongoDb.prototype.directoryDb = function (callback) {
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