import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

/**
 * Defines the supported locales and the default locale.
 * Arabic (ar) is the primary RTL locale; English (en) is the secondary LTR locale.
 */
export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
});

export type Locale = (typeof routing.locales)[number];

// Export i18n-aware navigation utilities
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
