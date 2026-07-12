const mongoose = require('mongoose');

// المادة التعليمية: ملف PDF أو فيديو أو جرافيك مرتبط بمادة وصف معيّن
const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'العنوان مطلوب'], trim: true },
    description: { type: String, default: '' },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    grade: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'video', 'graphic'], required: true },
    fileUrl: { type: String, required: true },
    provider: { type: String, enum: ['local', 'cloudinary', 'external'], default: 'local' },
    // مادة الصف التالي (للتحضير في الإجازة)
    isNextGrade: { type: Boolean, default: false },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// index للفلترة السريعة بالصف/المادة/النوع
materialSchema.index({ grade: 1, subject: 1, type: 1 });

materialSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.models.Material || mongoose.model('Material', materialSchema);
