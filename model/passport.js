var passport = require('passport');
var assert = require('assert');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var mysql = require('../../model/mysql.js');

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

passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req, userId, password, done) {
        // TODO: 회원 정보 일치하는지 확인하고 로그인.
        // 로그인 성공 시 user 객체 생성해서 return(null, user), 실패 시 return (null, false)
        // mongodb 썼을 때 코드: https://github.com/highalps/CoCo/commit/3b5f3ad21d80f5bebce92e4cb92392b8410989b6

        var userID = req.body.userID,
            password = req.body.password;

        var sql = "select * from USER where userID = ?";
        mysql.query(sql, userID ,function (err, result){
            if (err) {
                console.log('err :' + err);
                return done(err);
            } else {
                if (result.length === 0) {
                    //res.json({success: false, msg: '해당 아이디가 존재하지 않습니다.'})
                    return done(null, false, req.flash('err', '해당 아이디가 존재하지 않습니다.'))
                } else {
                    console.log(password);
                    console.log(result[0].password);
                    if (!bcrypt.compareSync(password, result[0].password)){
                        //res.json({success: false, msg : '비밀번호가 일치하지 않습니다.'})
                        //res.error()
                        return done(null, false, req.flash('err', '비밀번호가 일치하지 않습니다.'));
                    } else {
                        //res.json({success: true, msg: '로그인 되었습니다'})
                        return done(null, result[0]);
                    }
                }
            }
        });
    }
));

//구글 로그인
// passport.use(new GoogleStrategy({
//         clientID: "565437120355-6st0a0vdcblkviveld60uppe9hft8h4c.apps.googleusercontent.com",
//         clientSecret: "_K5lQEMuHXgHpYn0SYV8YN7T",
//         callbackURL: "http://external.sopad.ml:3000/api/auth/google/callback"
//     },
//     function(accessToken, refreshToken, profile, done) {
//         var query = {
//             id:profile.id,
//             name:profile.displayName
//         };
//         console.log("query+ ",query);
//         if (profile) {
//             database.collection('users').findOne(query, function (err, user) {
//                 assert.equal(err, null);
//
//                 // query에 맞는 유저정보가 없을 때 query 전체 저장
//                 if(!user){
//                     query['projectList'] = [ 8001 ];
//                     database.collection('users').insertOne(query);
//                 }
//             });
//             return done(null, profile);
//         }
//         else {
//             return done(null, false);
//         }
//     }
// ));

module.exports = passport;
