// منطق المصادقة: تسجيل/دخول/جلسة/تحديث توكن. الـcontroller بينده عليه فقط.
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const signAccess = (user) =>
  jwt.sign({ id: user._id, role: user.role, name: user.name }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });

const signRefresh = (user) =>
  jwt.sign({ id: user._id, type: 'refresh' }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });

const issueTokens = (user) => ({
  accessToken: signAccess(user),
  refreshToken: signRefresh(user),
});

const register = async (payload) => {
  const email = payload.email.toLowerCase();
  const exists = await User.findOne({ email });
  if (exists) throw ApiError.conflict('البريد الإلكتروني مسجّل من قبل');

  // كلمة المرور بتتشفّر تلقائياً في موديل User (pre-save hook)
  const user = await User.create({ ...payload, email });
  return { user: user.toJSON(), ...issueTokens(user) };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) throw ApiError.unauthorized('بيانات الدخول غير صحيحة');

  const ok = await user.comparePassword(password);
  if (!ok) throw ApiError.unauthorized('بيانات الدخول غير صحيحة');

  return { user: user.toJSON(), ...issueTokens(user) };
};

const me = async (id) => {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('المستخدم غير موجود');
  return user.toJSON();
};

const refresh = async (refreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.jwt.refreshSecret);
  } catch {
    throw ApiError.unauthorized('توكن التحديث غير صالح أو منتهي');
  }
  const user = await User.findById(decoded.id);
  if (!user) throw ApiError.unauthorized('المستخدم غير موجود');
  return { accessToken: signAccess(user) };
};

module.exports = { register, login, me, refresh };
