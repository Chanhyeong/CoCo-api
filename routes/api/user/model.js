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
    knex.schema.raw('select degree, intro, github, career, language ' +
        'from tutor, user where tutor.id = user.id and nickname = ? and user.is_tutor = true', nickname)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};

exports.getTutorInformationById = function (id, callback) {
    knex.select('*').from('tutor').where('id', id)
        .catch(function (err) {
            console.log(err);
            callback(500);
        }).then(callback);
};