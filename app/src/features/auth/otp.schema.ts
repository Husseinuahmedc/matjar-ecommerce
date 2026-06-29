import { z } from "zod";

export const phoneSchema = z.object({
  phone: z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/, "Invalid phone number format (e.g. +9647123456789) / رقم الهاتف غير صالح (مثال: +9647123456789)"),
});

export const verifyOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/, "Invalid phone number / رقم الهاتف غير صالح"),
  code: z
    .string()
    .length(6, "Code must be exactly 6 digits / يجب أن يتكون الرمز من 6 أرقام بالضبط"),
});

export const createPasswordSchema = z.object({
  phone: z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/, "Invalid phone number / رقم الهاتف غير صالح"),
  email: z.string().email("Invalid email address / البريد الإلكتروني غير صالح"),
  fullName: z.string().min(2, "Full name must be at least 2 characters / يجب أن يكون الاسم الكامل حرفين على الأقل"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters / يجب أن تكون كلمة المرور 8 أحرف على الأقل")
    .regex(/[A-Z]/, "Password must contain an uppercase letter / يجب أن تحتوي كلمة المرور على حرف كبير")
    .regex(/[0-9]/, "Password must contain a digit / يجب أن تحتوي كلمة المرور على رقم"),
  confirmPassword: z.string(),
  verifiedToken: z.string().min(1, "Missing verification token / رمز التحقق مفقود"),
  role: z.enum(["BUYER", "SELLER"]).default("BUYER"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match / كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

export const enterPasswordSchema = z.object({
  phone: z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/, "Invalid phone number / رقم الهاتف غير صالح"),
  password: z.string().min(1, "Password is required / كلمة المرور مطلوبة"),
  verifiedToken: z.string().min(1, "Missing verification token / رمز التحقق مفقود"),
});

export type PhoneInput = z.infer<typeof phoneSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type CreatePasswordInput = z.infer<typeof createPasswordSchema>;
export type EnterPasswordInput = z.infer<typeof enterPasswordSchema>;
