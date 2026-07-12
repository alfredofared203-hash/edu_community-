import { z } from "zod";
const loginSchema = z.object({
  email: z.string().email("\u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u063A\u064A\u0631 \u0635\u0627\u0644\u062D"),
  password: z.string().min(6, "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644")
});
const registerSchema = z.object({
  name: z.string().min(2, "\u0627\u0644\u0627\u0633\u0645 \u0642\u0635\u064A\u0631 \u062C\u062F\u0627\u064B"),
  email: z.string().email("\u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u063A\u064A\u0631 \u0635\u0627\u0644\u062D"),
  password: z.string().min(6, "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644"),
  role: z.enum(["student", "teacher", "admin"]),
  grade: z.string().optional(),
  schoolCode: z.string().optional(),
  nationalId: z.string().optional()
});
export {
  loginSchema,
  registerSchema
};
