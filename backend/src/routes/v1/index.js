const router = require('express').Router();

// ===== فهرس الإصدار الأول من الـAPI (/api/v1) =====
// المزايا الجديدة (المرحلة 3 وما بعدها) بتتركّب هنا بالمعمار الطبقي.
// المسارات القديمة (auth/materials/...) لسه على /api زي ما هي في server.js.

router.use('/auth', require('../auth'));                    // نفس مسارات المصادقة متاحة تحت v1 كمان (للتجديد)
router.use('/chat', require('./chat'));                    // سجل رسائل الشات (اللحظي في Socket)
router.use('/softskills', require('./softskill.routes'));  // المهارات الناعمة + التسليمات
router.use('/notifications', require('./notification.routes')); // الإشعارات
router.use('/recommendations', require('./recommendation.routes')); // ترشيح المدرسين

module.exports = router;
