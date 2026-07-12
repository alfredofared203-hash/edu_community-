// تجميع كل مسارات الإصدار الأول تحت /api/v1
const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/subjects', require('./subject.routes'));
router.use('/materials', require('./material.routes'));

module.exports = router;
