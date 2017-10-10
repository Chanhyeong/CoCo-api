var express = require('express');
var router = express.Router();
var controller = require('./controller')


router.get('/getUser/:id', controller.getUser);
router.post('/');
router.put('/');
router.delete('/');

module.exports = router;