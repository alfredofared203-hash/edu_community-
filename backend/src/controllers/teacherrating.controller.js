const User = require('../models/User');
const TeacherRating = require('../models/TeacherRating');

exports.getTeachers = async (req, res, next) => {
  try {
    const minRatings = 3; // عدد التقييمات المطلوب للثقة في المتوسط
    const globalAverage = 4.0; // المتوسط العام المفترض لكل المدرسين

    const teachers = await User.aggregate([
      { $match: { role: 'teacher' } },
      { 
        $lookup: { 
          from: 'teacherratings', // تأكد أن هذا الاسم يطابق اسم الكوليكشن في DB
          localField: '_id', 
          foreignField: 'teacherId', 
          as: 'ratings' 
        } 
      },
      { 
        $addFields: { 
          ratings_count: { $size: '$ratings' },
          avg_rating: { 
            $cond: [
              { $gt: [{ $size: '$ratings' }, 0] }, 
              { $avg: '$ratings.rating' }, 
              0
            ] 
          }
        }
      },
      { 
        $addFields: { 
          weighted_rating: { 
            $divide: [
              { $add: [{ $multiply: ['$ratings_count', '$avg_rating'] }, { $multiply: [minRatings, globalAverage] }] }, 
              { $add: ['$ratings_count', minRatings] }
            ] 
          }
        }
      },
      { $sort: { weighted_rating: -1, ratings_count: -1 } },
      { 
        $project: { 
          name: 1, 
          email: 1, 
          avg_rating: { $round: ['$avg_rating', 2] }, 
          ratings_count: 1, 
          weighted_rating: { $round: ['$weighted_rating', 2] } 
        } 
      }
    ]);
    
    res.json({ success: true, count: teachers.length, data: teachers });
  } catch (e) { next(e); }
};

exports.rateTeacher = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    
    // التحقق من صحة التقييم
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'the rating must be between 1 and 5' });
    }

    // التأكد من وجود المعلم
    const teacher = await User.findOne({ _id: req.params.id, role: 'teacher' });
    if (!teacher) return res.status(404).json({ error: 'the teacher does not exist' });

    // التحديث أو الإنشاء
    const ratingDoc = await TeacherRating.findOneAndUpdate(
      { teacherId: req.params.id, studentId: req.user.id },
      { rating, comment: comment || null },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "the rating was saved successfully", 
      data: ratingDoc 
    });
  } catch (e) { next(e); }
};