const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'الاسم مطلوب'], trim: true },
    email: {
      type: String,
      required: [true, 'البريد الإلكتروني مطلوب'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    // select:false => مايرجعش مع أي استعلام عادي إلا لو طلبناه صراحةً (.select('+password'))
    password: { type: String, required: [true, 'كلمة المرور مطلوبة'], minlength: 6, select: false },
    role: {
      type: String,
      required: true,
      enum: ['student', 'teacher', 'admin', 'supervisor'],
      default: 'student',
    },
    grade: { type: String, default: null },
    schoolCode: { type: String, default: null },
    nationalId: { type: String, default: null },
    points: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
  },
  { timestamps: true }
);

// تشفير كلمة المرور تلقائياً قبل الحفظ (فقط لو اتغيّرت).
// ملاحظة: في Mongoose الحديث، الـhook الـasync بيرجّع Promise ومش بياخد next.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// مقارنة كلمة مرور بنص عادي
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// تنظيف الإخراج: _id => id وحذف الحقول الحساسة
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
