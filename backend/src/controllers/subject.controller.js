const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const service = require('../services/subject.service');

exports.list = asyncHandler(async (req, res) => {
  const subjects = await service.list(req.query);
  sendSuccess(res, { data: { subjects } });
});

exports.create = asyncHandler(async (req, res) => {
  const subject = await service.create(req.body);
  sendSuccess(res, { statusCode: 201, message: 'تمت إضافة المادة الدراسية', data: { subject } });
});

exports.remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  sendSuccess(res, { message: 'تم حذف المادة الدراسية' });
});
