"use client";

import React, { useState, useActionState } from "react";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { sendPhoneOtp } from "@/actions/otp";

const initialState = { success: false as const, error: "" };

export default function PhoneRegisterForm() {
  const t = useTranslations("otp");
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [state, formAction, isPending] = useActionState(async (_prev: unknown, formData: FormData) => {
    const result = await sendPhoneOtp(_prev, formData);
    if (result.success) {
      const phoneEncoded = encodeURIComponent(phone);
      router.push(`/verify-otp?phone=${phoneEncoded}&flow=register`);
    }
    return result;
  }, initialState);

  return (
    <div className="w-full bg-card border border-border/50 shadow-xl rounded-xl p-8 backdrop-blur-md transition-all duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">{t("registerTitle")}</h2>
        <p className="text-sm text-muted-foreground mt-2">{t("whatsappDelivery")}</p>
      </div>

      <form action={formAction} className="space-y-4">
        {!state.success && state.error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm text-center font-medium animate-in fade-in duration-200">
            {state.error}
          </div>
        )}

        <div className="space-y-1.5 text-start">
          <label htmlFor="phone" className="text-sm font-semibold text-foreground/80">
            {t("phoneLabel")}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isPending}
            inputMode="tel"
            autoComplete="tel"
            className="w-full px-4 py-2.5 rounded-md border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary border-border"
            placeholder={t("phonePlaceholder")}
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
              <span>{t("sending")}</span>
            </>
          ) : (
            <span>{t("sendOtp")}</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/register" className="text-primary hover:underline font-semibold transition-colors">
            {t("switchToEmail")}
          </Link>
        </p>
      </div>
    </div>
  );
}
