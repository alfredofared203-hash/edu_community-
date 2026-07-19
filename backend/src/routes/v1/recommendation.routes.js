const router = require('express').Router();
const ctrl = require('../../controllers/recommendation.controller');

// مفتوح للجميع — الطالب يشوف المدرسين المرشّحين حسب التقييم
router.get('/teachers', ctrl.teachers);

module.exports = router;
