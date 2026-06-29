import type { Metadata } from "next";
import PhoneLoginForm from "@/components/auth/phone-login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول عبر واتساب | WhatsApp Login",
};

export default function PhoneLoginPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <PhoneLoginForm />
    </div>
  );
}
