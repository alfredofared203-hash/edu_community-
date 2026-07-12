const router = require('express').Router();
const User = require('../models/User');
const TeacherRating = require('../models/TeacherRating');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Get teachers and their rating summaries
router.get('/', async (req, res, next) => {
  try {
    const teachers = await User.aggregate([
      {
        $match: { role: 'teacher' },
      },
      {
        $lookup: {
          from: 'teacheratings',
          localField: '_id',
          foreignField: 'teacherId',
          as: 'ratings',
        },
      },
      {
        $project: {
          id: '$_id',
          name: '$name',
          email: '$email',
          avg_rating: {
            $cond: {
              if: { $gt: [{ $size: '$ratings' }, 0] },
              then: { $avg: '$ratings.rating' },
              else: 0,
            },
          },
          ratings_count: { $size: '$ratings' },
        },
      },
      {
        $sort: { avg_rating: -1 },
      },
    ]);

    res.json({ teachers });
  } catch (e) { next(e); }
});

// Submit/Update rating for a teacher
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
  } catch (e) { next(e); }
});

module.exports = router;
