var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('../config');
var knex = require('knex')(config.knexMysqlConfig);

var MYSQL_TYPE_LENGTH = {
    COMMON_STRING: 20,
    EMAIL: 30,
    MIDDLE_STRING: 50,
    LANGUAGE: 10,
    LONG_STRING: 200,
    DAY: 5, // 0 ~ 24
    CLASS_CHAT_NUMBER: 10,
    ONE_KOREAN_CHAR: 2
};

var MongoDb = {};
MongoDb.chatDb = function (callback) {
    MongoClient.connect(config.mongoUrl.chat, function (err, db) {
        assert.equal(err, null);
        callback(db);
    });
};
MongoDb.editorDb = function (callback) {
    MongoClient.connect(config.mongoUrl.editor, function (err, db) {
        assert.equal(err, null);
        callback(db);
    });
};


module.exports = {
    init: defineDatabaseSchemas,
    mongodb: MongoDb,
    knex: knex
};

// TODO: autogenerate 수정
function defineDatabaseSchemas () {
    knex.schema.hasTable('user')
        .then(function (exist) {
            if (!exist) {
                knex.schema.createTable('user', function (table) {
                    table.charset('utf8');
                    table.string('id', MYSQL_TYPE_LENGTH.COMMON_STRING).primary().notNullable();
                    table.string('password', MYSQL_TYPE_LENGTH.LONG_STRING).notNullable();
                    table.string('email', MYSQL_TYPE_LENGTH.EMAIL).notNullable().unique();
                    table.string('nickname', MYSQL_TYPE_LENGTH.COMMON_STRING).notNullable().unique();
                    table.boolean('is_tutor').notNullable().defaultTo(false);
                }).then(function () {
                    console.log('Table \'user\' is generated');

                    knex.schema.hasTable('tutor')
                        .then(function (exist) {
                            if (!exist) {
                                knex.schema.createTableIfNotExists('tutor', function (table) {
                                    table.charset('utf8');
                                    table.string('id', MYSQL_TYPE_LENGTH.COMMON_STRING).notNullable();
                                    table.string('degree', MYSQL_TYPE_LENGTH.MIDDLE_STRING).notNullable();
                                    table.string('intro', MYSQL_TYPE_LENGTH.MIDDLE_STRING).notNullable();
                                    table.string('github', MYSQL_TYPE_LENGTH.EMAIL).notNullable();
                                    table.string('career', MYSQL_TYPE_LENGTH.LONG_STRING).notNullable();
                                    table.string('language', MYSQL_TYPE_LENGTH.MIDDLE_STRING).notNullable();

                                    table.foreign('id').references('user.id').onDelete('cascade');
                                }).then(function () {
                                    console.log('Table \'tutor\' is generated');
                                });
                            }
                        });

                    knex.schema.hasTable('class')
                        .then(function (exist) {
                            if (!exist) {
                                knex.schema.createTable('class', function (table) {
                                    table.charset('utf8');
                                    table.increments('num');
                                    table.string('title', MYSQL_TYPE_LENGTH.MIDDLE_STRING).notNullable();
                                    table.string('content', MYSQL_TYPE_LENGTH.LONG_STRING).notNullable();
                                    table.string('language', MYSQL_TYPE_LENGTH.LANGUAGE).notNullable();
                                    table.integer('status', 1);
                                    table.string('tutor_nickname', MYSQL_TYPE_LENGTH.COMMON_STRING);
                                    table.string('student_nickname', MYSQL_TYPE_LENGTH.COMMON_STRING);
                                    table.date('date').notNullable();

                                    table.foreign('tutor_nickname').references('user.nickname').onDelete('cascade').onUpdate('cascade');
                                    table.foreign('student_nickname').references('user.nickname').onDelete('cascade').onUpdate('cascade');
                                }).then(function () {
                                    console.log('Table \'class\' is generated');
                                    knex.schema.raw('alter table class add fulltext(title, content, language)').then(function () {
                                        console.log('fulltext constraint');
                                    });
                                    knex.schema.raw('alter table class auto_increment value = 49152').then(function () {
                                        console.log('change auto_increment value');
                                    });

                                    knex.schema.hasTable('classtime')
                                        .then(function (exist) {
                                            if (!exist) {
                                                knex.schema.createTable('classtime', function (table) {
                                                    table.charset('utf8');
                                                    table.string('day', MYSQL_TYPE_LENGTH.ONE_KOREAN_CHAR).notNullable();
                                                    table.integer('start_time', MYSQL_TYPE_LENGTH.DAY).notNullable();
                                                    table.integer('end_time', MYSQL_TYPE_LENGTH.DAY).notNullable();
                                                    table.integer('class_number', MYSQL_TYPE_LENGTH.CLASS_CHAT_NUMBER).notNullable().unsigned();

                                                    table.foreign('class_number').references('class.num').onDelete('cascade');
                                                }).then(function () {
                                                    console.log('Table \'classtime\' is generated');
                                                });
                                            }
                                        });

                                    knex.schema.hasTable('chat')
                                        .then(function (exist) {
                                            if (!exist) {
                                                knex.schema.createTable('chat', function (table) {
                                                    table.charset('utf8');
                                                    table.increments('num');
                                                    table.string('writer', MYSQL_TYPE_LENGTH.COMMON_STRING).notNullable();
                                                    table.string('applicant', MYSQL_TYPE_LENGTH.COMMON_STRING).notNullable();
                                                    table.integer('class_number', MYSQL_TYPE_LENGTH.CLASS_CHAT_NUMBER).notNullable().unsigned();
                                                    table.string('time', MYSQL_TYPE_LENGTH.CLASS_CHAT_NUMBER + 2).notNullable();

                                                    table.foreign('writer').references('user.nickname').onDelete('cascade').onUpdate('cascade');
                                                    table.foreign('applicant').references('user.nickname').onDelete('cascade').onUpdate('cascade');
                                                    table.foreign('class_number').references('class.num').onDelete('cascade');
                                                }).then(function () {
                                                    console.log('Table \'chat\' is generated');
                                                });
                                            }
                                        });
                                });
                            }
                        });
                });
            }
        });
}
