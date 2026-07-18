const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    skill:       { type: mongoose.Schema.Types.ObjectId, ref: 'SoftSkill', required: true },
    student:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl:     { type: String, required: true },
    grade:       { type: Number, default: null },
    feedback:    { type: String, default: '' },
    gradedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

submissionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; return ret; },
});

module.exports = mongoose.models.SoftSkillSubmission ||
  mongoose.model('SoftSkillSubmission', submissionSchema);
