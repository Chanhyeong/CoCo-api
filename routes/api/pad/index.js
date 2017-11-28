var express = require('express');
var router = express.Router();
var controller = require('./controller');
var directoryController = require('./directory/controller');
var jwtHandler = require('../../../middleware/jwt-handler');


router.get('/:classNum', jwtHandler.decodeToken, controller.createTerminalConnect, directoryController.getDirectory);

router.use('/directory', require('./directory/router'));

module.exports = router;
