// Zod schemas للتحقق من مدخلات الـAuth.
const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'الاسم قصير جداً').max(120),
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور 6 أحرف على الأقل'),
  role: z.enum(['student', 'teacher', 'admin', 'supervisor']).default('student'),
  grade: z.string().optional().nullable(),
  schoolCode: z.string().optional().nullable(),
  nationalId: z.string().optional().nullable(),
});

const loginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10, 'توكن التحديث غير صالح'),
});

module.exports = { registerSchema, loginSchema, refreshSchema };
