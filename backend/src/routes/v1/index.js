const router = require('express').Router();

<<<<<<< HEAD

router.use('/chat', require('./chat'));
=======
router.use('/auth', require('./auth.routes'));
router.use('/subjects', require('./subject.routes'));
router.use('/materials', require('./material.routes'));
router.use('/softskills', require('./softskill.routes'));
>>>>>>> 11009bc8c152d1a6ced2bba8b1b6b8c0a515855c

module.exports = router;
