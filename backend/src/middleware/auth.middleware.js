// التحقق من التوكن (authenticate) + التحقق من الدور (authorize).
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('يجب تسجيل الدخول'));
  }
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, env.jwt.accessSecret);
    next();
  } catch (err) {
    next(ApiError.unauthorized('توكن غير صالح أو منتهي الصلاحية'));
  }
};

// authorize('teacher','admin') => يسمح فقط لهذه الأدوار
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden('لا تملك صلاحية تنفيذ هذا الإجراء'));
  }
  next();
};

module.exports = { authenticate, authorize };
