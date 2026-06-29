import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names safely — resolves conflicts and removes duplicates.
 * Use this everywhere instead of string concatenation for class names.
 *
 * Example: cn("px-4 py-2", condition && "bg-red-500")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price number into a locale-aware currency string.
 * Defaults to Arabic-Iraq locale with IQD currency.
 * IQD uses no decimal places.
 *
 * @param amount   - The numeric price value
 * @param locale   - BCP 47 locale string (e.g. "ar-IQ", "en-US")
 * @param currency - ISO 4217 currency code (e.g. "IQD", "USD")
 */
export function formatPrice(
  amount: number,
  locale: string = "ar-IQ",
  currency: string = "IQD"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a Date into a locale-aware string.
 *
 * @param date   - Date object or ISO string
 * @param locale - BCP 47 locale string
 */
export function formatDate(
  date: Date | string,
  locale: string = "ar-SA"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}
