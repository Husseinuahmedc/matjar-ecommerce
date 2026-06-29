"use client";

import React, { useState, useEffect, useActionState, useCallback } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { verifyPhoneOtp, sendPhoneOtp } from "@/actions/otp";
import OtpInput from "./otp-input";

const initialState = { success: false as const, error: "" };
const RESEND_COOLDOWN = 60;

interface VerifyOtpFormProps {
  phone: string;
}

export default function VerifyOtpForm({ phone }: VerifyOtpFormProps) {
  const t = useTranslations("otp");
  const router = useRouter();

  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const resendFn = async (_prev: unknown) => {
    const fd = new FormData();
    fd.set("phone", phone);
    const result = await sendPhoneOtp(_prev, fd);
    if (result.success) {
      setCountdown(RESEND_COOLDOWN);
    }
    return result;
  };
  const [resendState, resendAction, isResending] = useActionState(resendFn, initialState);

  const [verifyState, verifyAction, isVerifying] = useActionState(async (_prev: unknown, formData: FormData) => {
    const result = await verifyPhoneOtp(_prev, formData);
    if (result.success) {
      const phoneEncoded = encodeURIComponent(phone);
      const tokenEncoded = encodeURIComponent(result.data.verifiedToken);
      if (result.data.isNewUser) {
        router.push(`/create-password?phone=${phoneEncoded}&token=${tokenEncoded}`);
      } else {
        router.push(`/enter-password?phone=${phoneEncoded}&token=${tokenEncoded}`);
      }
    }
    return result;
  }, initialState);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleComplete = useCallback(() => {
    const fd = new FormData();
    fd.set("phone", phone);
    fd.set("code", code);
    verifyAction(fd);
  }, [phone, code, verifyAction]);

  const maskedPhone = phone.length > 7
    ? `${phone.slice(0, 4)} ${"X".repeat(Math.max(3, phone.length - 7))} ${phone.slice(-3)}`
    : phone;

  return (
    <div className="w-full bg-card border border-border/50 shadow-xl rounded-xl p-8 backdrop-blur-md transition-all duration-300">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">{t("enterCode")}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {t("otpSent", { phone: maskedPhone })}
        </p>
      </div>

      {!verifyState.success && verifyState.error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm text-center font-medium animate-in fade-in duration-200 mb-4">
          {verifyState.error}
        </div>
      )}

      {resendState.success && (
        <div className="bg-green-500/10 text-green-600 border border-green-500/20 rounded-md p-3 text-sm text-center font-medium animate-in fade-in duration-200 mb-4">
          {t("otpSent", { phone: maskedPhone })}
        </div>
      )}

      <div className="space-y-6">
        <OtpInput value={code} onChange={setCode} onComplete={handleComplete} disabled={isVerifying} />

        <form action={verifyAction} className="space-y-4">
          <input type="hidden" name="phone" value={phone} />
          <input type="hidden" name="code" value={code} />

          <button
            type="submit"
            disabled={isVerifying || code.length < 6}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-md shadow-md hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none transition-all cursor-pointer"
          >
            {isVerifying ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t("verifying")}</span>
              </>
            ) : (
              <span>{t("verify")}</span>
            )}
          </button>
        </form>

        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm text-muted-foreground">
              {t("resendIn", { seconds: countdown })}
            </p>
          ) : (
            <button
              onClick={() => resendAction()}
              disabled={isResending}
              className="text-sm text-primary hover:underline font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isResending ? `${t("sending")}...` : t("resend")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
