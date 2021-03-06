var knex = require('../../../middleware/database').knex;

exports.getUser = function (id, callback) {
    knex.select('id', 'email', 'nickname', { tutor: 'is_tutor' })
        .from('user').where('id', id)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};

exports.getPassword = function (id, callback) {
    knex.select('password').from('user').where('id', id)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};

exports.checkNickname = function (nickname, callback) {
    knex.select('*').from('user').where('nickname', nickname)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};

exports.createUser = function (data, callback) {
    knex.into('user').insert(data)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};

exports.registerTutor = function (data, callback) {
    knex.into('tutor').insert(data)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};

exports.getTutorInformationByNickname = function (nickname, callback) {
    knex.select('*').from('tutor','user')
        .join('user', 'tutor.id', '=', 'user.id')
        .where({'user.nickname': nickname , 'is_tutor' : true})
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};

exports.getTutorInformationById = function (id, callback) {
    knex.select('*').from('tutor')
        .join('user', 'tutor.id', '=', 'user.id')
        .where({'user.id' : id, 'user.is_tutor' : true})
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};

exports.delete = function (id, callback) {
    knex.del().from('user').where('id', id)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};