const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const service = require('../services/material.service');

exports.list = asyncHandler(async (req, res) => {
  const { items, meta } = await service.list(req.query);
  sendSuccess(res, { data: { materials: items, meta } });
});

exports.getOne = asyncHandler(async (req, res) => {
  const material = await service.getById(req.params.id);
  sendSuccess(res, { data: { material } });
});

exports.create = asyncHandler(async (req, res) => {
  const material = await service.create({ body: req.body, file: req.file, userId: req.user.id });
  sendSuccess(res, { statusCode: 201, message: 'تمت إضافة المادة التعليمية', data: { material } });
});

exports.remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id, req.user);
  sendSuccess(res, { message: 'تم حذف المادة التعليمية' });
});
