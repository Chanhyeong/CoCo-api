var express = require('express');
var router = express.Router();
var passport = require('../modules/passport');
var controller = require('./controller')

router.get('/login',
    // 인증실패시 401 리턴, {} -> 인증 스트레티지
    passport.authenticate('local', { failureFlash: true }),
    controller.login
);

router.get('/logout', controller.logout);

router.get('/signup', controller.signUp);

// router.get('/auth/google',
//     passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
//
// router.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/' }),
//     function(req, res) {
//         res.redirect('/#/sopad');
//     });

module.exports = router;
