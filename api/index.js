var express = require('express');
var router = express.Router();


// import userRouter      from './user/router'
// import protectedRouter from './protected/router'
// import meRouter        from './me/router'

router.use('/users',     userRouter)
router.use('/protected', protectedRouter)
router.use('/me',        meRouter)

module.exports = router;
