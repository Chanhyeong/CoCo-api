var express = require('express');
var router = express.Router();
var passport = require('../modules/passport');
var controller = require('./controller')

router.get('/login',
    passport.authenticate('local', { failureFlash: true }),
    controller.login
);

router.get('/logout', controller.logout);

router.get('/signup', controller.signUp);

module.exports = router;
