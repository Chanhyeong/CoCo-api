var express = require('express');
var router = express.Router();
var passport = require('../modules/passport');
var controller = require('./controller')

router.get('/login',
    passport.authenticate('local', { failureFlash: true }),
    controller.login
);
// TODO: /signup (회원가입) 구현

router.get('/logout', controller.logout);

module.exports = router;
