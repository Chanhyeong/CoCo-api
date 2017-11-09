var express = require('express');
var router = express.Router();
var controller = require('./controller');
var jwtHandler = require('../../../middleware/jwt-handler');

router.get('/', controller.getList);
router.get('/class/:num', controller.getOne);
router.post('/', controller.create);
router.post('/request/:num', controller.request);
router.put('/:num', controller.modify);
router.delete('/:num', jwtHandler.decodeToken, controller.delete);

router.use('/search', require('./search/router'));

module.exports = router;