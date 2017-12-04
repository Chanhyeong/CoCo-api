var express = require('express');
var router = express.Router();
var controller = require('./controller');
var directoryController = require('./directory/controller');
var jwtHandler = require('../../../middleware/jwt-handler');

router.put('/:classNum', jwtHandler.decodeToken, controller.save);
router.get('/:classNum', jwtHandler.decodeToken, controller.createTerminalConnect, directoryController.getDirectory);
router.use('/directory', require('./directory/router'));

module.exports = router;
