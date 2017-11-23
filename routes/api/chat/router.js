var express = require('express');
var router = express.Router();
var controller = require('./controller');
var jwtHandler = require('../../../middleware/jwt-handler');

router.get('/list', jwtHandler.decodeToken, controller.getMessages);
router.get('/:chatNumber', jwtHandler.decodeToken, controller.getMessage);
router.put('/request', controller.handleMatch);
router.put('/:chatNumber', jwtHandler.decodeToken, controller.sendMessage);
router.delete('/:chatNumber', controller.delete);

module.exports = router;
