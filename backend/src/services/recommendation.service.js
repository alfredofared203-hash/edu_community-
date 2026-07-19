const User = require('../models/User');

// ===== خدمة ترشيح المدرسين =====
// aggregation: بنحسب لكل مدرس متوسّط تقييمه وعدد تقييماته، ونرتّب بالأعلى.
async function recommendedTeachers(limit = 10) {
  const teachers = await User.aggregate([
    // (1) المدرسين بس
    { $match: { role: 'teacher' } },
    // (2) نجيب تقييمات كل مدرس
    {
      $lookup: {
        from: 'teacheratings',
        localField: '_id',
        foreignField: 'teacherId',
        as: 'ratings',
      },
    },
    // (3) نحسب المتوسّط والعدد — لو مفيش تقييمات المتوسّط = 0
    {
      $project: {
        id: '$_id',
        name: '$name',
        email: '$email',
        subject: '$subject',
        avgRating: {
          $cond: {
            if: { $gt: [{ $size: '$ratings' }, 0] },
            then: { $avg: '$ratings.rating' },
            else: 0,
          },
        },
        ratingsCount: { $size: '$ratings' },
      },
    },
    // (4) الأعلى تقييماً أولاً
    { $sort: { avgRating: -1 } },
    { $limit: limit },
  ]);

  return teachers;
}

module.exports = { recommendedTeachers };
