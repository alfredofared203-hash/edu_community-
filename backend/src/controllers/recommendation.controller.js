const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');
const service = require('../services/recommendation.service');

// المدرسون المرشّحون (الأعلى تقييماً)
exports.teachers = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const teachers = await service.recommendedTeachers(limit);
  sendSuccess(res, { data: { teachers } });
});
