"use client";

import { useTranslations } from "next-intl";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export default function PhoneInput({ value, onChange, disabled, error }: PhoneInputProps) {
  const t = useTranslations("otp");

  return (
    <div className="space-y-1.5 text-start">
      <label htmlFor="phone" className="text-sm font-semibold text-foreground/80">
        {t("phoneLabel")}
      </label>
      <input
        id="phone"
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        inputMode="tel"
        autoComplete="tel"
        className={`w-full px-4 py-2.5 rounded-md border text-sm bg-background/50 placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary ${
          error ? "border-destructive focus:ring-destructive/30 focus:border-destructive" : "border-border"
        }`}
        placeholder={t("phonePlaceholder")}
        required
      />
      {error && (
        <p className="text-xs text-destructive font-medium animate-in slide-in-from-top-1 duration-150">
          {error}
        </p>
      )}
    </div>
  );
}
