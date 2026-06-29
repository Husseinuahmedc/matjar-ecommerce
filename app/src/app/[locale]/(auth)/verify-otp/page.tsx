import type { Metadata } from "next";
import { redirect } from "next/navigation";
import VerifyOtpForm from "@/components/auth/verify-otp-form";

export const metadata: Metadata = {
  title: "التحقق من الرمز | Verify OTP",
};

interface VerifyOtpPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ phone?: string; flow?: string }>;
}

export default async function VerifyOtpPage({ params, searchParams }: VerifyOtpPageProps) {
  const { locale } = await params;
  const search = await searchParams;
  const phone = search.phone;
  const flow = search.flow;

  if (!phone || !["login", "register"].includes(flow || "")) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <VerifyOtpForm phone={phone} />
    </div>
  );
}