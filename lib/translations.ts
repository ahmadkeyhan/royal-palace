import type { Translations } from "./i18n"
import enTranslations from "../locales/en.json"
import faTranslations from "../locales/fa.json"

export const translations: Translations = {
  en: enTranslations,
  fa: faTranslations,
}

export function getTranslations(locale: string) {
  return translations[locale as keyof Translations] || translations.en
}
