var express = require('express');
var router = express.Router();

router.get('/');

router.use('/compile', require('./compile/router'));
router.use('/directory', require('./directory/router'));

module.exports = router;
