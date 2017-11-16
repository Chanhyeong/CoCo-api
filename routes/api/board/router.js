var express = require('express');
var router = express.Router();
var controller = require('./controller');
var jwtHandler = require('../../../middleware/jwt-handler');

router.get('/', controller.getList);
router.get('/class/:num', controller.getOne);
router.post('/', jwtHandler.decodeToken, controller.create);
router.post('/request', jwtHandler.decodeToken, controller.request);
router.put('/:num', jwtHandler.decodeToken, controller.modify);
router.delete('/:num', jwtHandler.decodeToken, controller.delete);

router.use('/search', require('./search/router'));

module.exports = router;
