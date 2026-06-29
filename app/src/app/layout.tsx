/**
 * Root layout — minimal wrapper required by Next.js.
 *
 * Why is this almost empty?
 * The real layout (with <html lang dir>, fonts, providers) lives in:
 *   src/app/[locale]/layout.tsx
 *
 * next-intl requires that locale-specific rendering happens inside [locale]/.
 * This root layout is kept minimal to avoid conflicting with that.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
