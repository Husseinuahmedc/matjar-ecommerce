import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * next-intl server-side request configuration.
 * Loads the correct message file based on the active locale.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Fall back to the default locale if the requested locale is invalid
  if (!locale || !routing.locales.includes(locale as "ar" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
