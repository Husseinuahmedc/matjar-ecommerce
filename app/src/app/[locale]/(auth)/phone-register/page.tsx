import type { Metadata } from "next";
import PhoneRegisterForm from "@/components/auth/phone-register-form";

export const metadata: Metadata = {
  title: "إنشاء حساب عبر واتساب | WhatsApp Sign Up",
};

export default function PhoneRegisterPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <PhoneRegisterForm />
    </div>
  );
}
