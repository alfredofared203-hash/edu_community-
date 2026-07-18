const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('the token is required'));
  }
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, env.jwt.accessSecret);
    next();
  } catch (err) {
    next(ApiError.unauthorized('the token is invalid or expired'));
  }
};

// authorize('teacher','admin') => يسمح فقط لهذه الأدوار
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden('not allowed for this role'));
  }
  next();
};

module.exports = { authenticate, authorize };
