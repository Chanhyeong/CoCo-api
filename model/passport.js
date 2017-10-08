var passport = require('passport');
var assert = require('assert');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var mysql = require('./mysql');

//serializer와 deseriazlier는 필수로 구현해야 함.

// 인증 후, 사용자 정보를 Session에 저장함
passport.serializeUser(function(user, done) {
    //console.log('로그인 성공', user);
    done(null, user);
});

// 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
passport.deserializeUser(function(user, done) {
    // console.log('session 호출', user);
    done(null, user);
});

passport.use('local', new LocalStrategy({
        usernameField : 'userID',
        passwordField : 'password',
        passReqToCallback : true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
    }, function(req, userID, password, done) {
        var sql = "select * from USER where userID = ?";
        mysql.query(sql, userID ,function (err, result){
            if (err) {
                console.log('err :' + err);
                return done(err);
            } else {
                if (result.length === 0) {
                    return done(null, false)
                } else {
                    console.log(password);
                    console.log(result[0].password);
                    if (!bcrypt.compareSync(password, result[0].password)){
                        return done(null, false)
                    } else {
                        return done(null, result[0]);
                    }
                }
            }
        });
    }
));

module.exports = passport;
