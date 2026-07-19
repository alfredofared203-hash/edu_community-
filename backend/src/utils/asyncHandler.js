// كل الكنترولرز async. لو حصل خطأ جواها Express مش بيمسكه لوحده.
// اللفّة دي بتمسك أي خطأ وتوديه للـ error middleware عن طريق next(err)،
// عشان الكنترولر نفسه يفضل نضيف من غير try/catch.
// الاستخدام: router.get('/', asyncHandler(controller.list))
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
