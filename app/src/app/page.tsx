import { redirect } from "next/navigation";

/**
 * Root page — redirects to the default locale (Arabic).
 *
 * Why a redirect?
 * The actual homepage lives at /ar (or /en).
 * next-intl handles locale routing — but we need a redirect at / for the root.
 * In production, this can also be handled at the CDN/middleware level.
 */
export default function RootPage() {
  redirect("/ar");
}
