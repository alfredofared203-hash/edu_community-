const router = require('express').Router();
const ctrl = require('../../controllers/notification.controller');
const { authenticate } = require('../../middleware/auth.middleware');

// كل مسارات الإشعارات محتاجة تسجيل دخول
router.use(authenticate);

router.get('/', ctrl.list);                    // قائمة إشعاراتي + عدد غير المقروء
router.patch('/read-all', ctrl.markAllRead);   // تعليم الكل كمقروء (قبل /:id)
router.patch('/:id/read', ctrl.markRead);      // تعليم إشعار كمقروء

module.exports = router;
