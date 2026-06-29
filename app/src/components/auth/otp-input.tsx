"use client";

import { useRef, type KeyboardEvent, type ClipboardEvent } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: () => void;
  disabled?: boolean;
}

const DIGIT_COUNT = 6;

export default function OtpInput({ value, onChange, onComplete, disabled }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, "");
    if (!digit) return;

    const newValue = value.split("");
    newValue[index] = digit;
    const joined = newValue.join("");
    onChange(joined);

    if (index < DIGIT_COUNT - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (joined.length === DIGIT_COUNT && onComplete) {
      onComplete();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newValue = value.split("");
      newValue[index] = "";
      onChange(newValue.join(""));

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < DIGIT_COUNT - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGIT_COUNT);
    onChange(pasted);

    const focusIndex = Math.min(pasted.length, DIGIT_COUNT - 1);
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === DIGIT_COUNT && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="flex gap-2 justify-center" dir="ltr">
      {Array.from({ length: DIGIT_COUNT }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${DIGIT_COUNT}`}
          className={`w-12 h-14 text-center text-xl font-bold rounded-md border bg-background/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary ${
            disabled ? "opacity-50 cursor-not-allowed" : "border-border"
          }`}
        />
      ))}
    </div>
  );
}
