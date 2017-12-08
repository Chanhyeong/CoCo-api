var express = require('express');
var router = express.Router();
var controller = require('./controller');
var jwtHandler = require('../../../middleware/jwt-handler')

router.get('/', jwtHandler.decodeToken, controller.getUserInformation);
//router.get('/getUser/', jwtHandler.decodeToken, controller.getUser);
router.get('/tutor/id/:id', controller.getTutorInformationById);
router.get('/tutor/nickname/:nickname', controller.getTutorInformationByNickname);
router.post('/tutor', jwtHandler.decodeToken, controller.registerTutor);

module.exports = router;
