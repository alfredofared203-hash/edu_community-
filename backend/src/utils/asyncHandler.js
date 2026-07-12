// بيلفّ أي controller async ويمرّر أي خطأ تلقائياً لـ next() بدل تكرار try/catch.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
