import { z } from "zod";

/**
 * Authentication Validation Schemas
 *
 * These schemas are shared between the client (for immediate feedback)
 * and the server (as a final security check).
 *
 * Note: Error messages are bilingual (English / Arabic) separated by " / ".
 * The UI components split these based on the current locale.
 */

export const signInSchema = z.object({
  email: z.string().email("Invalid email address / البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "Password must be at least 8 characters / يجب أن تكون كلمة المرور 8 أحرف على الأقل"),
});

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address / البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "Password must be at least 8 characters / يجب أن تكون كلمة المرور 8 أحرف على الأقل"),
  fullName: z.string().min(2, "Full name must be at least 2 characters / يجب أن يكون الاسم الكامل حرفين على الأقل"),
  role: z.enum(["BUYER", "SELLER"]).default("BUYER"),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
