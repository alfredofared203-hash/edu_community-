const router = require('express').Router();
const ctrl = require('../../controllers/material.controller');
const validate = require('../../middleware/validate.middleware');
const { authenticate, authorize } = require('../../middleware/auth.middleware');
const upload = require('../../middleware/upload.middleware');
const { createMaterialSchema } = require('../../validators/material.validator');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

// الرفع للمدرس والأدمن فقط. ترتيب الـmiddleware: توكن -> دور -> ملف -> تحقق -> controller
router.post(
  '/',
  authenticate,
  authorize('teacher', 'admin'),
  upload.single('file'),
  validate(createMaterialSchema),
  ctrl.create
);

router.delete('/:id', authenticate, authorize('teacher', 'admin'), ctrl.remove);

module.exports = router;
