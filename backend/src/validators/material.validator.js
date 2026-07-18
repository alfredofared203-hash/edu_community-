const { z } = require('zod');

const createSubjectSchema = z.object({
  name: z.string().min(2, 'subject name is required'),
  grade: z.string().min(1, 'grade is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const createMaterialSchema = z.object({
  title: z.string().min(2, 'title is required'),
  description: z.string().optional(),
  subject: z.string().min(1, 'subject is required'),
  grade: z.string().min(1, 'grade is required'),
  type: z.enum(['pdf', 'video', 'graphic'], { message: 'invalid type' }),
  isNextGrade: z.union([z.boolean(), z.string()]).optional(),
  fileUrl: z.string().url('invalid url').optional(), // for external <videos></videos>
});

module.exports = { createSubjectSchema, createMaterialSchema };
