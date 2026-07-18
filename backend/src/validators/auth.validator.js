const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'name too short').max(120),
  email: z.string().email('invalid email'),
  password: z.string().min(6, 'password too short'),
  role: z.enum(['student', 'teacher', 'admin', 'supervisor']).default('student'),
  grade: z.string().optional().nullable(),
  schoolCode: z.string().optional().nullable(),
  nationalId: z.string().optional().nullable(),
});

const loginSchema = z.object({
  email: z.string().email('invalid email'),
  password: z.string().min(6, 'password too short'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10, 'invalid refresh token'),
});

module.exports = { registerSchema, loginSchema, refreshSchema };
