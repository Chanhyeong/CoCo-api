var express = require('express');
var router = express.Router();
var controller = require('./controller');
var jwtHandler = require('../../middleware/jwt-handler');

router.post('/login', controller.signIn);
router.post('/signup', controller.signUp);
router.delete('/', jwtHandler.decodeToken, controller.leave)

module.exports = router;
