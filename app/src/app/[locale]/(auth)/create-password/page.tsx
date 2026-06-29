import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { validateVerifiedToken } from "@/services/otp.service";
import CreatePasswordForm from "@/components/auth/create-password-form";

export const metadata: Metadata = {
  title: "إنشاء كلمة المرور | Create Password",
};

interface CreatePasswordPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ phone?: string; token?: string }>;
}

export default async function CreatePasswordPage({ params, searchParams }: CreatePasswordPageProps) {
  const { locale } = await params;
  const search = await searchParams;
  const phone = search.phone;
  const token = search.token;

  if (!phone || !token) {
    redirect(`/${locale}/phone-register`);
  }

  const valid = await validateVerifiedToken(phone, token);
  if (!valid) {
    redirect(`/${locale}/phone-register`);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <CreatePasswordForm phone={phone} verifiedToken={token} />
    </div>
  );
}