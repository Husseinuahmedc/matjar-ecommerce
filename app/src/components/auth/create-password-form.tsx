"use client";

import React, { useState, useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { completeRegistration } from "@/actions/otp";
import PasswordStrength from "./password-strength";

const initialState = { success: false as const, error: "" };

interface CreatePasswordFormProps {
  phone: string;
  verifiedToken: string;
}

export default function CreatePasswordForm({ phone, verifiedToken }: CreatePasswordFormProps) {
  const t = useTranslations("otp");
  const auth = useTranslations("auth");
  const locale = useLocale();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");
  const [localError, setLocalError] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(async (_prev: unknown, formData: FormData) => {
    if (password !== confirmPassword) {
      return { success: false as const, error: t("passwordMismatch") };
    }
    return completeRegistration(_prev, formData);
  }, initialState);

  return (
    <div className="w-full bg-card border border-border/50 shadow-xl rounded-xl p-8 backdrop-blur-md transition-all duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">{t("createPassword")}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {phone.length > 7
            ? `${phone.slice(0, 4)} ${"X".repeat(Math.max(3, phone.length - 7))} ${phone.slice(-3)}`
            : phone}
        </p>
      </div>

      <form action={formAction} onSubmit={() => setLocalError(null)} className="space-y-4">
        {(!state.success && 'error' in state && state.error || localError) ? (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm text-center font-medium animate-in fade-in duration-200">
            {localError || (!state.success && 'error' in state && state.error)}
          </div>
        ) : null}

        <input type="hidden" name="phone" value={phone} />
        <input type="hidden" name="verifiedToken" value={verifiedToken} />

        <div className="space-y-1.5 text-start">
          <label htmlFor="fullName" className="text-sm font-semibold text-foreground/80">
            {auth("fullName")}
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isPending}
            className="w-full px-4 py-2.5 rounded-md border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary border-border"
            placeholder={locale === "ar" ? "أحمد علي" : "John Doe"}
            autoComplete="name"
            required
          />
        </div>

        <div className="space-y-1.5 text-start">
          <label htmlFor="reg-email" className="text-sm font-semibold text-foreground/80">
            {auth("email")}
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full px-4 py-2.5 rounded-md border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary border-border"
            placeholder="name@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-1.5 text-start">
          <label htmlFor="password" className="text-sm font-semibold text-foreground/80">
            {auth("password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="w-full px-4 py-2.5 rounded-md border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary border-border"
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
          <PasswordStrength password={password} />
        </div>

        <div className="space-y-1.5 text-start">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground/80">
            {t("confirmPassword")}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isPending}
            className="w-full px-4 py-2.5 rounded-md border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary border-border"
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
        </div>

        <input type="hidden" name="role" value={role} />

        <div className="space-y-2 text-start">
          <label className="text-sm font-semibold text-foreground/80">
            {auth("role")}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole("BUYER")}
              disabled={isPending}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer select-none active:scale-[0.98] ${
                role === "BUYER" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-transparent hover:bg-secondary/40"
              }`}
            >
              <svg className={`h-6 w-6 mb-1.5 ${role === "BUYER" ? "text-primary" : "text-muted-foreground"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs font-bold text-foreground">{auth("buyerRole")}</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("SELLER")}
              disabled={isPending}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer select-none active:scale-[0.98] ${
                role === "SELLER" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-transparent hover:bg-secondary/40"
              }`}
            >
              <svg className={`h-6 w-6 mb-1.5 ${role === "SELLER" ? "text-primary" : "text-muted-foreground"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-xs font-bold text-foreground">{auth("sellerRole")}</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-md shadow-md hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none transition-all cursor-pointer mt-6"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{t("creatingAccount")}</span>
            </>
          ) : (
            <span>{t("createAccount")}</span>
          )}
        </button>
      </form>
    </div>
  );
}
