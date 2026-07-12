// Zod schemas للمواد والمواد الدراسية (Subjects & Materials).
const { z } = require('zod');

const createSubjectSchema = z.object({
  name: z.string().min(2, 'اسم المادة مطلوب'),
  grade: z.string().min(1, 'الصف مطلوب'),
  description: z.string().optional(),
  icon: z.string().optional(),
});

// ملاحظة: بيانات إنشاء المادة بتيجي multipart/form-data (مع ملف)،
// فالحقول كلها نصوص. isNextGrade ممكن تيجي 'true'/'false'.
const createMaterialSchema = z.object({
  title: z.string().min(2, 'العنوان مطلوب'),
  description: z.string().optional(),
  subject: z.string().min(1, 'المادة الدراسية مطلوبة'),
  grade: z.string().min(1, 'الصف مطلوب'),
  type: z.enum(['pdf', 'video', 'graphic'], { message: 'النوع غير صالح' }),
  isNextGrade: z.union([z.boolean(), z.string()]).optional(),
  fileUrl: z.string().url('رابط غير صالح').optional(), // للفيديو الخارجي مثلاً
});

module.exports = { createSubjectSchema, createMaterialSchema };
