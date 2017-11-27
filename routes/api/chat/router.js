var express = require('express');
var router = express.Router();
var controller = require('./controller');
var jwtHandler = require('../../../middleware/jwt-handler');

router.get('/list', jwtHandler.decodeToken, controller.getMessages);
router.get('/:chatNum', jwtHandler.decodeToken, controller.getMessage);
router.put('/request/:chatNum', controller.handleMatch);
router.put('/:chatNum', jwtHandler.decodeToken, controller.sendMessage);
router.delete('/:chatNum', controller.delete);

module.exports = router;
