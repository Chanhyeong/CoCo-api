var express = require('express');
var router = express.Router();
var passport = require('../modules/passport');
var abc = require('./controller')

router.get('/login', passport)
router.get('/join', passport, abc.login())

export default router
