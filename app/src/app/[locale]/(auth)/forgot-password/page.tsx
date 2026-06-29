import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "نسيت كلمة المرور | Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <ForgotPasswordForm />
    </div>
  );
}
