var express = require('express');
var router = express.Router();
var controller = require('./controller')


router.get('/:classNum', controller.TerminalConnect);
router.post('/');
router.put('/');
router.delete('/');

module.exports = router;