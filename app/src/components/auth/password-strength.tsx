"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): { score: number; labelKey: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 1) return { score, labelKey: "strength.weak" };
  if (score === 2) return { score, labelKey: "strength.fair" };
  if (score === 3) return { score, labelKey: "strength.good" };
  return { score, labelKey: "strength.strong" };
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const t = useTranslations("otp");

  const { score, labelKey } = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  const segments = 4;
  const filled = score;

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
              i < filled
                ? score <= 1
                  ? "bg-destructive"
                  : score === 2
                    ? "bg-orange-400"
                    : score === 3
                      ? "bg-yellow-400"
                      : "bg-green-500"
                : "bg-border"
            }`}
          />
        ))}
      </div>
      <p
        className={`text-xs font-medium ${
          score <= 1
            ? "text-destructive"
            : score === 2
              ? "text-orange-400"
              : score === 3
                ? "text-yellow-500"
                : "text-green-500"
        }`}
      >
        {t(labelKey)}
      </p>
    </div>
  );
}
