var express = require('express');
var router = express.Router();
var controller = require('./controller')

router.get('/getUser/:id', controller.getUser);
router.get('/getClass/:id', controller.getClass);
router.get('/getWriter/:id', controller.getWriter);
router.get('/getApplicant/:id', controller.getApplicant);
router.get('/getTutor/:id', controller.getTutor);
router.post('/tutor/:id', controller.regist);

module.exports = router;
