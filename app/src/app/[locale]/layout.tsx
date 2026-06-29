import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "@/app/globals.css";
import { CartProvider } from "@/hooks/use-cart";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Toaster } from "@/components/ui/sonner";

/**
 * Cairo covers both Arabic and Latin scripts cleanly — chosen per e-commerce.md.
 * Using CSS variable so Tailwind can reference it via `font-sans`.
 */
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Matjar — متجر",
    default: "Matjar — متجر",
  },
  description: "منصة تسوق إلكتروني متعددة البائعين | Multi-seller e-commerce platform",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Reject unsupported locales — renders Next.js 404 page
  if (!routing.locales.includes(locale as "ar" | "en")) {
    notFound();
  }

  // Fetch messages for the current locale — passed to the client provider
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${cairo.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            {children}
            <CartDrawer />
            <Toaster />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
