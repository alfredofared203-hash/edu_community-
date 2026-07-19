const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');

// ===== خدمة الإشعارات =====
// كل منطق الإشعارات هنا. الكنترولر بينادي الدوال دي بس.

// إنشاء إشعار + بثّه لحظياً للمستخدم عبر Socket (لو هو أونلاين).
// io بييجي من التطبيق (req.app.get('io')) عشان مانستوردش دائرة.
async function notify(io, { user, type, title, body, link }) {
  const notification = await Notification.create({ user, type, title, body, link });
  // نبعت الإشعار لغرفة المستخدم الشخصية (بننضمّه لها في الـsocket handler)
  if (io) io.to('user:' + user).emit('notification', notification);
  return notification;
}

// إشعارات المستخدم الحالي (الأحدث أولاً)
async function listForUser(userId) {
  const notifications = await Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50);
  const unread = notifications.filter((n) => !n.read).length;
  return { notifications, unread };
}

// تعليم إشعار كمقروء (لازم يكون بتاع نفس المستخدم)
async function markRead(id, userId) {
  const notification = await Notification.findOne({ _id: id, user: userId });
  if (!notification) throw ApiError.notFound('الإشعار غير موجود');
  notification.read = true;
  await notification.save();
  return notification;
}

// تعليم كل الإشعارات كمقروءة
async function markAllRead(userId) {
  await Notification.updateMany({ user: userId, read: false }, { read: true });
  return { ok: true };
}

module.exports = { notify, listForUser, markRead, markAllRead };
