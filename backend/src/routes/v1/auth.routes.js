const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const ctrl = require('../../controllers/auth.controller');
const validate = require('../../middleware/validate.middleware');
const { authenticate } = require('../../middleware/auth.middleware');
const { registerSchema, loginSchema, refreshSchema } = require('../../validators/auth.validator');

// حد للمحاولات على مسارات الدخول/التسجيل لمنع الـbrute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'محاولات كثيرة، حاول لاحقاً' },
});

router.post('/register', authLimiter, validate(registerSchema), ctrl.register);
router.post('/login', authLimiter, validate(loginSchema), ctrl.login);
router.post('/refresh', validate(refreshSchema), ctrl.refresh);
router.get('/me', authenticate, ctrl.me);
router.post('/logout', authenticate, ctrl.logout);

module.exports = router;
