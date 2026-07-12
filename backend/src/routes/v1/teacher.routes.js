const router = require('express').Router();
const User = require('../../models/User');
const TeacherRating = require('../../models/TeacherRating');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

 router.get('/', async (req, res, next) => {
  try {
    // الثوابت الخاصة بالمعادلة المرجّحة
    const m = 3;   // الحد الأدنى من التقييمات ليعطى المدرس وزناً ترشيحياً قوياً
    const C = 4.0; // المتوسط العام الافتراضي لتقييمات الموقع ككل

    const teachers = await User.aggregate([
      // 1. جلب المستخدمين الذين يملكون رتبة معلم فقط
      {
        $match: { role: 'teacher' },
      },
      // 2. ربط جدول المدرسين بجدول التقييمات
      {
        $lookup: {
          from: 'teacheratings', // تأكد أن الاسم مطابق لاسم الـ Collection في قاعدة البيانات
          localField: '_id',
          foreignField: 'teacherId',
          as: 'ratings',
        },
      },
      // 3. حساب الحقول الأساسية: عدد التقييمات والمتوسط البسيط
      {
        $addFields: {
          ratings_count: { $size: '$ratings' },
          avg_rating: {
            $cond: {
              if: { $gt: [{ $size: '$ratings' }, 0] },
              then: { $avg: '$ratings.rating' },
              else: 0,
            },
          },
        },
      },
      // 4. تطبيق معادلة التقييم المرجّح (Bayesian Average) لحساب الوزن الفعلي والترتيب العادل
      {
        $addFields: {
          weighted_rating: {
            $divide: [
              {
                $add: [
                  { $multiply: ['$ratings_count', '$avg_rating'] },
                  { $multiply: [m, C] }
                ]
              },
              { $add: ['$ratings_count', m] }
            ]
          }
        }
      },
      // 5. الترتيب تنازلياً بناءً على التقييم المرجّح الجديد
      {
        $sort: { weighted_rating: -1, ratings_count: -1 },
      },
      // 6. تشكيل البيانات النهائية المطلوبة للـ Frontend
      {
        $project: {
          id: '$_id',
          name: '$name',
          email: '$email',
          avg_rating: { $round: ['$avg_rating', 2] },
          ratings_count: 1,
          weighted_rating: { $round: ['$weighted_rating', 2] }, // الحقل المرجّح مقرباً لرقمين
        },
      },
    ]);

    res.json({ teachers });
  } catch (e) { 
    next(e); 
  }
});

// Submit/Update rating for a teacher (يبقى كما هو بدون تغيير في منطقه)
router.post('/:id/rate', authenticate, authorize('student'), async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'تقييم غير صحيح' });

    const teacher = await User.findOne({ _id: req.params.id, role: 'teacher' });
    if (!teacher) return res.status(404).json({ error: 'المعلم غير موجود' });

    const ratingDoc = await TeacherRating.findOneAndUpdate(
      { teacherId: req.params.id, studentId: req.user.id },
      { rating, comment: comment || null },
      { new: true, upsert: true }
    );

    res.status(201).json({
      rating: {
        id: ratingDoc._id,
        teacher_id: ratingDoc.teacherId,
        student_id: ratingDoc.studentId,
        rating: ratingDoc.rating,
        comment: ratingDoc.comment,
      },
    });
  } catch (e) { 
    next(e); 
  }
});

module.exports = router;