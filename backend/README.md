# EduCommunity Egypt - Backend API

Node.js + Express + PostgreSQL backend for the EduCommunity Egypt educational platform.

## التشغيل

```bash
# 1. تثبيت الحزم
npm install

# 2. إعداد المتغيرات البيئية
cp .env.example .env
# عدّل القيم في ملف .env

# 3. إنشاء قاعدة البيانات
psql -U postgres -f database/schema.sql

# 4. تشغيل السيرفر
npm run dev
```

السيرفر يعمل على: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` — تسجيل جديد (طالب / معلم / مدير)
- `POST /api/auth/login` — تسجيل الدخول
- `GET  /api/auth/me` — بيانات المستخدم الحالي

### Posts (Feed)
- `GET    /api/posts` — قائمة المنشورات
- `POST   /api/posts` — منشور جديد
- `POST   /api/posts/:id/like` — إعجاب
- `POST   /api/posts/:id/comments` — تعليق

### Challenges
- `GET  /api/challenges` — التحديات الأسبوعية
- `POST /api/challenges/:id/submit` — تسليم تحدي

### Leaderboard
- `GET /api/leaderboard` — المتصدرون
- `GET /api/leaderboard/schools` — أفضل المدارس

### Teachers
- `GET  /api/teachers` — قائمة المعلمين
- `POST /api/teachers/:id/rate` — تقييم معلم

### Admin
- `GET /api/admin/stats` — إحصائيات
- `GET /api/admin/users` — إدارة المستخدمين

## التقنيات
- Express.js
- PostgreSQL (pg)
- JWT Authentication
- Multer (file uploads)
- Bcrypt (password hashing)
- Helmet + CORS (security)
