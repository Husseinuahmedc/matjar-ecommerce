"use client";

import React, { useState, useTransition } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { signIn } from "@/actions/auth";
import { signInSchema } from "@/features/auth/schema";

export default function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const validationResult = signInSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as "email" | "password";
        const messageParts = issue.message.split(" / ");
        fieldErrors[path] = isRtl ? messageParts[1] || messageParts[0] : messageParts[0];
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await signIn({ ...validationResult.data, rememberMe });

      if (!result?.success) {
        if (result?.error === "EMAIL_NOT_VERIFIED") {
          // Redirect to verify-email page with email pre-filled
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
        const parts = (result?.error ?? "An error occurred").split(" / ");
        setServerError(isRtl ? (parts[1] || parts[0]) : parts[0]);
      }
    });
  };

  return (
    <div className="w-full bg-card border border-border/50 shadow-xl rounded-xl p-8 backdrop-blur-md transition-all duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">{t("loginTitle")}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-semibold transition-colors"
          >
            {t("signUpButton")}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm text-center font-medium animate-in fade-in duration-200">
            {serverError}
          </div>
        )}

        {/* Email Field */}
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
            className={`w-full px-4 py-2.5 rounded-md border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary ${
              errors.email
                ? "border-destructive focus:ring-destructive/30 focus:border-destructive"
                : "border-border"
            }`}
            placeholder="name@example.com"
            autoComplete="email"
            required
          />
          {errors.email && (
            <p className="text-xs text-destructive font-medium animate-in slide-in-from-top-1 duration-150">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 text-start">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-semibold text-foreground/80">
              {t("password")}
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline transition-colors font-medium"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              className={`w-full px-4 py-2.5 rounded-md border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary pr-10 ${
                errors.password
                  ? "border-destructive focus:ring-destructive/30 focus:border-destructive"
                  : "border-border"
              }`}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive font-medium animate-in slide-in-from-top-1 duration-150">
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isPending}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40 accent-primary cursor-pointer"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm text-muted-foreground cursor-pointer select-none"
          >
            {t("rememberMe")}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-md shadow-md hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none transition-all cursor-pointer mt-2"
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
            <span>{t("signInButton")}</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/phone-login"
            className="text-primary hover:underline font-semibold transition-colors"
          >
            {t("whatsappLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
