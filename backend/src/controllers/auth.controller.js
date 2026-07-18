const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const authService = require('../services/auth.service');

exports.register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  sendSuccess(res, { statusCode: 201, message: 'تم إنشاء الحساب بنجاح', data });
});

exports.login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  sendSuccess(res, { message: 'تم تسجيل الدخول', data });
});

exports.me = asyncHandler(async (req, res) => {
  const user = await authService.me(req.user.id);
  sendSuccess(res, { data: { user } });
});

exports.refresh = asyncHandler(async (req, res) => {
  const data = await authService.refresh(req.body.refreshToken);
  sendSuccess(res, { message: 'تم تحديث الجلسة', data });
});

exports.logout = asyncHandler(async (req, res) => {
  sendSuccess(res, { message: 'تم تسجيل الخروج' });
});
