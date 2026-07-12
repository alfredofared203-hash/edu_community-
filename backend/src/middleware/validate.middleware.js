// Middleware يتحقق من المدخلات باستخدام Zod schema.
// لو في خطأ يرمي ApiError(422) بتفاصيل الحقول، ولو سليم يستبدل المدخلات بالنسخة المُتحقّق منها.
const ApiError = require('../utils/ApiError');

const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const errors = result.error.issues.map((i) => ({
      field: i.path.join('.') || source,
      message: i.message,
    }));
    return next(ApiError.validation(errors));
  }
  req[source] = result.data;
  next();
};

module.exports = validate;
