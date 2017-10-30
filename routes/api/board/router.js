var express = require('express');
var router = express.Router();
var controller = require('./controller');

router.get('/', controller.create);
router.post('/');
router.put('/');
router.delete('/:num');

module.exports = router;