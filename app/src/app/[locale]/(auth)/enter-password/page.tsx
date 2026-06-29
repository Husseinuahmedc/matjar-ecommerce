import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { validateVerifiedToken } from "@/services/otp.service";
import EnterPasswordForm from "@/components/auth/enter-password-form";

export const metadata: Metadata = {
  title: "إدخال كلمة المرور | Enter Password",
};

interface EnterPasswordPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ phone?: string; token?: string }>;
}

export default async function EnterPasswordPage({ params, searchParams }: EnterPasswordPageProps) {
  const { locale } = await params;
  const search = await searchParams;
  const phone = search.phone;
  const token = search.token;

  if (!phone || !token) {
    redirect(`/${locale}/phone-login`);
  }

  const valid = await validateVerifiedToken(phone, token);
  if (!valid) {
    redirect(`/${locale}/phone-login`);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <EnterPasswordForm phone={phone} verifiedToken={token} />
    </div>
  );
}