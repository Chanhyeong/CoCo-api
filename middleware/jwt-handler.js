var jwt = require('jsonwebtoken');
var pick = require('lodash/pick');

var SECRET = process.env.JWT || 'coco_token_secret';
var EXPIRES = 60*60; // 1 hour

exports.signToken = function (user) {
    console.log('jwt-handler.js: signToken');
    return jwt.sign({ user: user }, SECRET, { expiresIn : EXPIRES });
}

// 토큰을 해독한 후, 사용자 ID를 request에 추가합니다.
exports.decodeToken = function (req, res, next) {
    console.log('jwt-handler.js: decodeToken');
    if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer' + req.query.access_token;
    }

    var token = '';

    if (req.headers.authorization)
        token = req.headers.authorization.split(' ')[1];

    if (token) {
        // 토큰을 해독한 후, 사용자 정보(id)를 request에 추가합니다.
        jwt.verify(token, SECRET, function(err, decoded) {
            if (err)
                res.status(401).send('사용자 인증에 실패했습니다.');
            else {
                req.user = decoded;
                next();
            }
        })
    }
    else {
        res.status(403).send('토큰이 필요합니다.')
    }
}