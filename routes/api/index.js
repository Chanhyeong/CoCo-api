var express = require('express');
var router = express.Router();

router.use('/board', require('./board'));
router.use('/pad', require('./pad/router'));
router.use('/user', require('./user/router'));

module.exports = router;
