require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const connectDB = require('./config/db');
require('./config/cloudinary'); // تهيئة Cloudinary
const { notFound, errorHandler } = require('./middleware/error.middleware');

// مسارات الإصدار الأول (المعمار الجديد)
const v1Routes = require('./routes/v1');

// مسارات قديمة (لسه شغّالة — تم ترحيل مسار المدرسين بنجاح)
const postRoutes = require('./routes/post.routes');
const challengeRoutes = require('./routes/challenge.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const adminRoutes = require('./routes/admin.routes'); // 👈 تم حذف استدعاء teacherRoutes من هنا

connectDB();

const app = express();

// أمان وأساسيات
app.use(helmet());
app.use(cors({ origin: env.nodeEnv === 'production' ? env.clientUrl : true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (env.nodeEnv !== 'test') app.use(morgan('dev'));

// حد عام للطلبات لكل IP
app.use(
  rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false })
);

// ملفات الرفع المحلية
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// فحص صحة الخدمة
app.get('/api/health', (req, res) =>
  res.json({ success: true, service: 'EduCommunity Egypt API', version: '1.0', time: new Date() })
);

 app.use('/api/v1', v1Routes);

 app.use('/api/posts', postRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);  


 app.use(notFound);
app.use(errorHandler);

const server = app.listen(env.port, () =>
  console.log(`🚀 EduCommunity Egypt API running on http://localhost:${env.port}`)
);

 process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = app;