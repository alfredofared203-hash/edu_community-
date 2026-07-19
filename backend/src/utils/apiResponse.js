// كل ردود الـAPI بتطلع بنفس الشكل الموحّد: { success, message, data, meta? }
// كده الفرونت بيتعامل مع شكل واحد ثابت في كل الطلبات.

// رد ناجح — بياخد options object:
//   sendSuccess(res, { statusCode, message, data, meta })
function sendSuccess(res, { statusCode = 200, message = '', data = null, meta } = {}) {
  const body = { success: true, message, data };
  if (meta) body.meta = meta; // meta بتيجي بس مع القوائم المقسّمة لصفحات
  return res.status(statusCode).json(body);
}

// رد خطأ — بيستخدمه الـ error middleware
function sendError(res, statusCode = 500, message = 'حصل خطأ في السيرفر') {
  return res.status(statusCode).json({ success: false, message, data: null });
}

module.exports = { sendSuccess, sendError };
