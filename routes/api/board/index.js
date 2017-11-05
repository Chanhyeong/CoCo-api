var express = require('express');
var router = express.Router();

router.use('/', require('./router'));
router.use('/search', require('./search/router'));

module.exports = router;