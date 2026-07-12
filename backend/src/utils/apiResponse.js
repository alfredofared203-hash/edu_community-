// شكل رد موحّد لكل الـAPI الجديدة: { success, message, data, meta? }
const sendSuccess = (res, { statusCode = 200, message = 'تم بنجاح', data = null, meta } = {}) => {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
};

module.exports = { sendSuccess };
