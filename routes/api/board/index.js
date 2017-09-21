var express = require('express');
var router = express.Router();

router.use('/qna', require('./qna/router'));
router.use('/tutoring', require('./tutoring/router'));

module.exports = router;