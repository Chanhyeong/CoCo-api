var express = require('express');
var router = express.Router();
var passport = require('../modules/passport');
var controller = require('./controller')

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    controller.login);


export default router
