const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const service = require('../services/notification.service');

// قائمة إشعاراتي + عدد غير المقروء
exports.list = asyncHandler(async (req, res) => {
  const { notifications, unread } = await service.listForUser(req.user.id);
  sendSuccess(res, { data: { notifications, unread } });
});

// تعليم إشعار كمقروء
exports.markRead = asyncHandler(async (req, res) => {
  const notification = await service.markRead(req.params.id, req.user.id);
  sendSuccess(res, { message: 'تم التعليم كمقروء', data: { notification } });
});

// تعليم الكل كمقروء
exports.markAllRead = asyncHandler(async (req, res) => {
  await service.markAllRead(req.user.id);
  sendSuccess(res, { message: 'تم تعليم كل الإشعارات كمقروءة' });
});
