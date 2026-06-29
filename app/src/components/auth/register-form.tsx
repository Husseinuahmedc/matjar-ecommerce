"use client";

import React, { useState, useTransition } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { signUp } from "@/actions/auth";
import { signUpSchema } from "@/features/auth/schema";

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak / ضعيفة", color: "bg-red-500" };
  if (score === 2) return { score, label: "Fair / مقبولة", color: "bg-orange-400" };
  if (score === 3) return { score, label: "Good / جيدة", color: "bg-yellow-400" };
  return { score, label: "Strong / قوية", color: "bg-green-500" };
}

export default function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");

  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const validationResult = signUpSchema.safeParse({ fullName, email, password, role });

    if (!validationResult.success) {
      const fieldErrors: { fullName?: string; email?: string; password?: string } = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as "fullName" | "email" | "password";
        const messageParts = issue.message.split(" / ");
        fieldErrors[path] = isRtl ? messageParts[1] || messageParts[0] : messageParts[0];
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const result = await signUp(validationResult.data);

      if (!result.success) {
        const parts = (result.error ?? "").split(" / ");
        setServerError(isRtl ? (parts[1] || parts[0]) : parts[0]);
        return;
      }

      // Redirect to verify-email page — email verification required
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    });
  };

  return (
    <div className="w-full bg-card border border-border/50 shadow-xl rounded-xl p-8 backdrop-blur-md transition-all duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">{t("registerTitle")}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {t("hasAccount")}{" "}
          <Link href="/login" className="text-primary hover:underline font-semibold transition-colors">
            {t("signInButton")}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm text-center font-medium animate-in fade-in duration-200">
            {serverError}
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-1.5 text-start">
          <label htmlFor="fullName" className="text-sm font-semibold text-foreground/80">
            {t("fullName")}
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isPending}
            className={`w-full px-4 py-2.5 rounded-md border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary ${
              errors.fullName ? "border-destructive focus:ring-destructive/30" : "border-border"
            }`}
            placeholder={isRtl ? "أحمد علي" : "John Doe"}
            autoComplete="name"
            required
          />
          {errors.fullName && (
            <p className="text-xs text-destructive font-medium animate-in slide-in-from-top-1 duration-150">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
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
              errors.email ? "border-destructive focus:ring-destructive/30" : "border-border"
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

        {/* Password */}
        <div className="space-y-1.5 text-start">
          <label htmlFor="password" className="text-sm font-semibold text-foreground/80">
            {t("password")}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              className={`w-full px-4 py-2.5 rounded-md border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary pr-10 ${
                errors.password ? "border-destructive focus:ring-destructive/30" : "border-border"
              }`}
              placeholder="••••••••"
              autoComplete="new-password"
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

          {/* Password strength */}
          {password.length > 0 && (
            <div className="space-y-1 mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      strength.score >= i ? strength.color : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {isRtl ? "القوة:" : "Strength:"}{" "}
                <span
                  className={`font-semibold ${
                    strength.score >= 3
                      ? "text-green-500"
                      : strength.score >= 2
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {isRtl
                    ? strength.label.split(" / ")[1]
                    : strength.label.split(" / ")[0]}
                </span>
              </p>
            </div>
          )}

          {errors.password && (
            <p className="text-xs text-destructive font-medium animate-in slide-in-from-top-1 duration-150">
              {errors.password}
            </p>
          )}
        </div>

        {/* Role Selection */}
        <div className="space-y-2 text-start">
          <label className="text-sm font-semibold text-foreground/80">{t("role")}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("BUYER")}
              disabled={isPending}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer select-none active:scale-[0.98] ${
                role === "BUYER"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-transparent hover:bg-secondary/40"
              }`}
            >
              <svg
                className={`h-6 w-6 mb-1.5 ${role === "BUYER" ? "text-primary" : "text-muted-foreground"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs font-bold text-foreground">{t("buyerRole")}</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("SELLER")}
              disabled={isPending}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer select-none active:scale-[0.98] ${
                role === "SELLER"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-transparent hover:bg-secondary/40"
              }`}
            >
              <svg
                className={`h-6 w-6 mb-1.5 ${role === "SELLER" ? "text-primary" : "text-muted-foreground"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-xs font-bold text-foreground">{t("sellerRole")}</span>
            </button>
          </div>
        </div>

        {/* Submit */}
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
            <span>{t("signUpButton")}</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/phone-register" className="text-primary hover:underline font-semibold transition-colors">
            {t("whatsappSignup")}
          </Link>
        </p>
      </div>
    </div>
  );
}
