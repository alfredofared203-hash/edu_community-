const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    grade: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'video', 'graphic'], required: true },
    fileUrl: { type: String, required: true },       
    isNextGrade: { type: Boolean, default: false },  
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

materialSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.models.Material || mongoose.model('Material', materialSchema);
