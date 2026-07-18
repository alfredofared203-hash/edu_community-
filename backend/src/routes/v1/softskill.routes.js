const router = require('express').Router();
const ctrl = require('../../controllers/softskill.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');

router.use(authenticate);

// قائمة المهارات (الكل)
router.get('/', ctrl.list);

// إنشاء مهارة (المدرس والأدمن فقط)
router.post('/', authorize('teacher', 'admin'), ctrl.create);

// رفع بريزنتيشن (الطالب)
router.post('/:skillId/submit', authorize('student'), upload.single('presentation'), ctrl.submit);

// عرض تسليمات مهارة (المدرس والأدمن)
router.get('/:skillId/submissions', authorize('teacher', 'admin'), ctrl.getSubmissions);

// تصحيح تسليم (المدرس والأدمن)
router.post('/submissions/:submissionId/grade', authorize('teacher', 'admin'), ctrl.grade);

module.exports = router;
