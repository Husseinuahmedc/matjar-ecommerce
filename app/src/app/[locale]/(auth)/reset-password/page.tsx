import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "إعادة تعيين كلمة المرور | Reset Password",
};

/**
 * Reset Password page.
 *
 * The user arrives here after clicking the reset link in their email.
 * Supabase automatically sets a session from the magic link token in the URL.
 * The form calls resetPassword() which uses that session to update the password.
 */
export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <ResetPasswordForm />
    </div>
  );
}
