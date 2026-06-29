import type { Metadata } from "next";
import VerifyEmailPrompt from "@/components/auth/verify-email-prompt";

export const metadata: Metadata = {
  title: "تحقق من البريد الإلكتروني | Verify Email",
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string }>;
}

/**
 * Verify Email page.
 *
 * Shown after registration to inform the user to check their email.
 * Also reachable from login when the account's email is not verified.
 * Provides a "Resend" button.
 */
export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { email } = await searchParams;

  return (
    <div className="w-full max-w-md mx-auto">
      <VerifyEmailPrompt email={email} />
    </div>
  );
}
