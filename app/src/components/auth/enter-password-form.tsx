"use client";

import React, { useState, useActionState } from "react";
import { useTranslations } from "next-intl";
import { completeLogin } from "@/actions/otp";

const initialState = { success: false as const, error: "" };

interface EnterPasswordFormProps {
  phone: string;
  verifiedToken: string;
}

export default function EnterPasswordForm({ phone, verifiedToken }: EnterPasswordFormProps) {
  const t = useTranslations("otp");
  const auth = useTranslations("auth");
  const [password, setPassword] = useState("");

  const [state, formAction, isPending] = useActionState(async (_prev: unknown, formData: FormData) => {
    return completeLogin(_prev, formData);
  }, initialState);

  const maskedPhone = phone.length > 7
    ? `${phone.slice(0, 4)} ${"X".repeat(Math.max(3, phone.length - 7))} ${phone.slice(-3)}`
    : phone;

  return (
    <div className="w-full bg-card border border-border/50 shadow-xl rounded-xl p-8 backdrop-blur-md transition-all duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">{t("enterPassword")}</h2>
        <p className="text-sm text-muted-foreground mt-2">{maskedPhone}</p>
      </div>

      <form action={formAction} className="space-y-4">
        {!state.success && 'error' in state && state.error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm text-center font-medium animate-in fade-in duration-200">
            {state.error}
          </div>
        )}

        <input type="hidden" name="phone" value={phone} />
        <input type="hidden" name="verifiedToken" value={verifiedToken} />

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
            autoComplete="current-password"
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
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{auth("loading")}</span>
            </>
          ) : (
            <span>{t("loginButton")}</span>
          )}
        </button>
      </form>
    </div>
  );
}
