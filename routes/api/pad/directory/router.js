var express = require('express');
var router = express.Router();
var controller = require('./controller');
var jwtHandler = require('../../../../middleware/jwt-handler');

router.put('/:classNum', jwtHandler.decodeToken, controller.rename);
router.post('/', jwtHandler.decodeToken, controller.create);
router.delete('/', jwtHandler.decodeToken, controller.delete);

module.exports = router;
