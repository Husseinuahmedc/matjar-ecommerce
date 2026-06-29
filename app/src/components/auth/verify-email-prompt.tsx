"use client";

import React, { useState, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { resendVerificationEmail } from "@/actions/auth";

interface VerifyEmailPromptProps {
  email?: string;
}

export default function VerifyEmailPrompt({ email }: VerifyEmailPromptProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [resendEmail, setResendEmail] = useState(email ?? "");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleResend = () => {
    setError(null);
    startTransition(async () => {
      const result = await resendVerificationEmail(resendEmail);
      if (!result.success) {
        const parts = (result.error ?? "").split(" / ");
        setError(isRtl ? (parts[1] || parts[0]) : parts[0]);
        setStatus("error");
        return;
      }
      setStatus("sent");
    });
  };

  return (
    <div className="w-full bg-card border border-border/50 shadow-xl rounded-xl p-8 backdrop-blur-md text-center">
      {/* Icon */}
      <div className="flex justify-center mb-5">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        {isRtl ? "تحقق من بريدك الإلكتروني" : "Verify Your Email"}
      </h2>

      <p className="text-sm text-muted-foreground mb-1 leading-relaxed">
        {isRtl
          ? "أرسلنا رابط التحقق إلى:"
          : "We sent a verification link to:"}
      </p>

      {resendEmail && (
        <p className="font-semibold text-foreground mb-4 text-sm break-all">{resendEmail}</p>
      )}

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-xs mx-auto">
        {isRtl
          ? "انقر على الرابط الموجود في البريد الإلكتروني لتفعيل حسابك. تحقق من مجلد البريد غير المرغوب فيه إذا لم تجده."
          : "Click the link in the email to activate your account. Check your spam folder if you don't see it."}
      </p>

      {/* Resend section */}
      <div className="border-t border-border pt-5 mt-2">
        {status === "sent" ? (
          <div className="flex items-center justify-center gap-2 text-sm text-green-500 font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isRtl ? "تم إرسال رسالة جديدة!" : "New email sent!"}
          </div>
        ) : (
          <div className="space-y-3">
            {!email && (
              <input
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder={isRtl ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                className="w-full px-4 py-2.5 rounded-md border border-border text-sm bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            )}
            {error && (
              <p className="text-xs text-destructive font-medium">{error}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {isRtl ? "لم تستلم الرسالة؟" : "Didn't receive the email?"}
            </p>
            <button
              onClick={handleResend}
              disabled={isPending || !resendEmail}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-semibold disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isRtl ? "جاري الإرسال..." : "Sending..."}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isRtl ? "إعادة إرسال رسالة التحقق" : "Resend Verification Email"}
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-border">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
          {isRtl ? "العودة لتسجيل الدخول" : "Back to Login"}
        </Link>
      </div>
    </div>
  );
}
