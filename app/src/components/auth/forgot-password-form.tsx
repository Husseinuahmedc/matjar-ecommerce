"use client";

import React, { useState, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { requestPasswordReset } from "@/actions/auth";

export default function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError(
        isRtl
          ? "يرجى إدخال بريد إلكتروني صالح."
          : "Please enter a valid email address."
      );
      return;
    }

    startTransition(async () => {
      const result = await requestPasswordReset(email);
      if (!result.success) {
        const parts = (result.error ?? "").split(" / ");
        setError(isRtl ? (parts[1] || parts[0]) : parts[0]);
        return;
      }
      setSuccess(true);
    });
  };

  if (success) {
    return (
      <div className="w-full bg-card border border-border/50 shadow-xl rounded-xl p-8 backdrop-blur-md text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          {isRtl ? "تم إرسال البريد الإلكتروني" : "Check Your Email"}
        </h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {isRtl
            ? `إذا كان البريد الإلكتروني ${email} مسجلاً، ستصلك رسالة تحتوي على رابط لإعادة تعيين كلمة المرور. تحقق من صندوق البريد الوارد والبريد غير المرغوب فيه.`
            : `If ${email} is registered, you'll receive a password reset link shortly. Check your inbox and spam folder.`}
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRtl ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
          {isRtl ? "العودة لتسجيل الدخول" : "Back to Login"}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-card border border-border/50 shadow-xl rounded-xl p-8 backdrop-blur-md transition-all duration-300">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t("forgotPasswordTitle")}</h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {t("forgotPasswordDesc")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm text-center font-medium animate-in fade-in duration-200">
            {error}
          </div>
        )}

        <div className="space-y-1.5 text-start">
          <label htmlFor="email" className="text-sm font-semibold text-foreground/80">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full px-4 py-2.5 rounded-md border border-border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            placeholder="name@example.com"
            autoComplete="email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-md shadow-md hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none transition-all cursor-pointer mt-6"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{t("loading")}</span>
            </>
          ) : (
            <span>{t("sendResetLink")}</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-center text-sm text-muted-foreground">
          {t("rememberPassword")}{" "}
          <Link href="/login" className="text-primary hover:underline font-semibold transition-colors">
            {t("signInButton")}
          </Link>
        </p>
      </div>
    </div>
  );
}
