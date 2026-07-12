const router = require('express').Router();
const ctrl = require('../../controllers/subject.controller');
const validate = require('../../middleware/validate.middleware');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const { createSubjectSchema } = require('../../validators/material.validator');

router.get('/', ctrl.list); // تصفّح المواد متاح للجميع
router.post('/', authenticate, authorize('teacher', 'admin'), validate(createSubjectSchema), ctrl.create);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
