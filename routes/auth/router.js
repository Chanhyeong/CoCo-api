var express = require('express');
var router = express.Router();
var controller = require('./controller');

router.post('/login', controller.signIn);
router.post('/signup', controller.signUp);

module.exports = router;
d