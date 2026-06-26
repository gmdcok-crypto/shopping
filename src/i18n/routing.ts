import { defineRouting } from "next-intl/routing";

export const locales = ["ko", "en", "ru", "uz"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "ko",
  localePrefix: "always",
});

export const localeNames: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ru: "Русский",
  uz: "O'zbekcha",
};
