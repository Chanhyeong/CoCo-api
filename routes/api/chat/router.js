var express = require('express');
var router = express.Router();
var controller = require('./controller');
var jwtHandler = require('../../../middleware/jwt-handler');

router.get('/list', jwtHandler.decodeToken, controller.getMessages);
router.get('/:chatNumber', controller.getMessage);
router.put('/:chatNumber', jwtHandler.decodeToken, controller.sendMessage);
router.post('/request', controller.handleMatch);

module.exports = router;