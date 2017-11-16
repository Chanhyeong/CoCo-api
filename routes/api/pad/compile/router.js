var express = require('express');
var router = express.Router();
var controller = require('./controller')


router.get('/getConnect', controller.TerminalConnect);
router.get('/getCompile', controller.Compile);
router.post('/');
router.put('/');
router.delete('/');

module.exports = router;