var express = require('express');
var router = express.Router();
var controller = require('./controller')

router.get('/getUser/:id', controller.getUser);
router.get('/getClass/:nickname', controller.getClass);
router.get('/getWriter/:nickname', controller.getWriter);
router.get('/getApplicant/:nickname', controller.getApplicant);
router.get('/TutorInfo/:id', controller.TutorInfo);
router.get('/getTutor/:nickname', controller.getTutor);
router.post('/tutor', controller.regist);

module.exports = router;
