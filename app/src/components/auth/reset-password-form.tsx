"use client";

import React, { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { resetPassword } from "@/actions/auth";

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

export default function ResetPasswordForm() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(
        isRtl
          ? "يجب أن تكون كلمة المرور 8 أحرف على الأقل."
          : "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirm) {
      setError(isRtl ? "كلمات المرور غير متطابقة." : "Passwords do not match.");
      return;
    }

    if (strength.score < 2) {
      setError(
        isRtl
          ? "كلمة المرور ضعيفة جداً. أضف أحرفاً كبيرة وأرقاماً ورموزاً."
          : "Password is too weak. Add uppercase letters, numbers and symbols."
      );
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(password);
      if (result && !result.success) {
        const parts = (result.error ?? "").split(" / ");
        setError(isRtl ? (parts[1] || parts[0]) : parts[0]);
      }
    });
  };

  return (
    <div className="w-full bg-card border border-border/50 shadow-xl rounded-xl p-8 backdrop-blur-md transition-all duration-300">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {isRtl ? "إعادة تعيين كلمة المرور" : "Reset Password"}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {isRtl ? "أنشئ كلمة مرور جديدة لحسابك." : "Create a new password for your account."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm text-center font-medium animate-in fade-in duration-200">
            {error}
          </div>
        )}

        {/* New Password */}
        <div className="space-y-1.5 text-start">
          <label htmlFor="password" className="text-sm font-semibold text-foreground/80">
            {isRtl ? "كلمة المرور الجديدة" : "New Password"}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              className="w-full px-4 py-2.5 rounded-md border border-border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary pr-10"
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

          {/* Password strength indicator */}
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
                <span className={`font-semibold ${strength.score >= 3 ? "text-green-500" : strength.score >= 2 ? "text-yellow-500" : "text-red-500"}`}>
                  {isRtl ? strength.label.split(" / ")[1] : strength.label.split(" / ")[0]}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5 text-start">
          <label htmlFor="confirm" className="text-sm font-semibold text-foreground/80">
            {isRtl ? "تأكيد كلمة المرور" : "Confirm Password"}
          </label>
          <input
            id="confirm"
            type={showPassword ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={isPending}
            className={`w-full px-4 py-2.5 rounded-md border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary ${
              confirm && confirm !== password
                ? "border-destructive focus:ring-destructive/30"
                : "border-border"
            }`}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
          {confirm && confirm !== password && (
            <p className="text-xs text-destructive font-medium">
              {isRtl ? "كلمات المرور غير متطابقة" : "Passwords do not match"}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || (confirm !== "" && confirm !== password)}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-md shadow-md hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none transition-all cursor-pointer mt-6"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{isRtl ? "جاري الحفظ..." : "Saving..."}</span>
            </>
          ) : (
            <span>{isRtl ? "إعادة تعيين كلمة المرور" : "Reset Password"}</span>
          )}
        </button>
      </form>
    </div>
  );
}
