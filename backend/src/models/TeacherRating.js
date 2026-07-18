const mongoose = require('mongoose');

const teacherRatingSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

teacherRatingSchema.index({ teacherId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('TeacherRating', teacherRatingSchema);
