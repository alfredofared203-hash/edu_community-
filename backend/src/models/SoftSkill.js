const mongoose = require('mongoose');

const softSkillSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    icon:        { type: String, default: 'HelpCircle' },
    color:       { type: String, default: 'blue' },
    coursesCount:{ type: Number, default: 0 },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

softSkillSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; return ret; },
});

module.exports = mongoose.models.SoftSkill || mongoose.model('SoftSkill', softSkillSchema);
