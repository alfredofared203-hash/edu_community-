// كلاس بسيط للأخطاء المتوقّعة.
// بدل ما نكتب res.status(404).json(...) في كل مكان،
// بنعمل: throw ApiError.notFound('المهارة غير موجودة')
// والـ error middleware بيحوّلها لرد HTTP بالشكل الموحّد.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode; // كود HTTP (400 / 401 / 403 / 404 / 409 ...)
    this.isOperational = true;    // خطأ متوقّع إحنا رميناه، مش باج في السيرفر
  }

  // دوال مختصرة لأشهر الأخطاء
  static badRequest(message) { return new ApiError(400, message); }
  static unauthorized(message) { return new ApiError(401, message); }
  static forbidden(message) { return new ApiError(403, message); }
  static notFound(message) { return new ApiError(404, message); }
  static conflict(message) { return new ApiError(409, message); }
}

module.exports = ApiError;
