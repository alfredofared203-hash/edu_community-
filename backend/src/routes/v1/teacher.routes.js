const router = require('express').Router();
const User = require('../../models/User');
const TeacherRating = require('../../models/TeacherRating');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

 router.get('/', async (req, res, next) => {
  try {
     const m = 3;    
    const C = 4.0;  
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
       {
        $sort: { weighted_rating: -1, ratings_count: -1 },
      },
       {
        $project: {
          id: '$_id',
          name: '$name',
          email: '$email',
          avg_rating: { $round: ['$avg_rating', 2] },
          ratings_count: 1,
          weighted_rating: { $round: ['$weighted_rating', 2] },  
      },
    ]);

    res.json({ teachers });
  } catch (e) { 
    next(e); 
  }
});

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