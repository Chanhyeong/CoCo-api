var express = require('express');
var router = express.Router();
var controller = require('./controller');
var jwtHandler = require('../../../../middleware/jwt-handler');

router.get('/:classNum', jwtHandler.decodeToken , controller.getDir);
router.put('/', jwtHandler.decodeToken, controller.update);

module.exports = router;
