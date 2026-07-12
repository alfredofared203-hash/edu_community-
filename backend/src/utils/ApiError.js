// خطأ موحّد للتطبيق: بيحمل status code + رسالة + تفاصيل اختيارية.
// أي حتة في الكود ترمي ApiError، والـerror middleware يترجمها لرد منظّم.
class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // خطأ متوقّع (مش bug في السيرفر)
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'طلب غير صالح', errors = null) {
    return new ApiError(400, message, errors);
  }
  static unauthorized(message = 'غير مصرّح') {
    return new ApiError(401, message);
  }
  static forbidden(message = 'لا تملك صلاحية الوصول') {
    return new ApiError(403, message);
  }
  static notFound(message = 'غير موجود') {
    return new ApiError(404, message);
  }
  static conflict(message = 'تعارض في البيانات') {
    return new ApiError(409, message);
  }
  static validation(errors, message = 'بيانات غير صالحة') {
    return new ApiError(422, message, errors);
  }
}

module.exports = ApiError;
