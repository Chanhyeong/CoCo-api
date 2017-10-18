var express = require('express');
var router = express.Router();
var controller = require('./controller');
var jwtHandler = require('../../../middleware/jwt-handler');

router.get('/:tnum');
router.get('/list', jwtHandler.decodeToken, controller.getList);
router.post('/');
router.put('/');
router.delete('/');

module.exports = router;