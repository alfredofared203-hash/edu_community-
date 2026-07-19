const mongoose = require('mongoose');

// إشعار لمستخدم — بيتبعت لحظياً عبر Socket كمان (سطر واحد في السيرفس).
const notificationSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // صاحب الإشعار
    type:    { type: String, default: 'info' },   // نوع الإشعار (info / grade / message ...)
    title:   { type: String, required: true },
    body:    { type: String, default: '' },
    link:    { type: String, default: '' },        // رابط داخلي يفتحه الإشعار (اختياري)
    read:    { type: Boolean, default: false },     // اتقرأ ولا لسه
  },
  { timestamps: true }
);

notificationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; return ret; },
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
