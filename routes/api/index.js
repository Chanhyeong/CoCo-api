var express = require('express');
var router = express.Router();

router.use('/board', require('./board/router'));
router.use('/pad', require('./pad/'));
router.use('/user', require('./user/router'));
router.use('/chat', require('./chat/router'));

module.exports = router;
