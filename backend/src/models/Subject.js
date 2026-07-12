const mongoose = require('mongoose');


const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    grade: { type: String, required: true }, 
    description: { type: String, default: '' },
    icon: { type: String, default: 'book' },
  },
  { timestamps: true }
);

subjectSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
