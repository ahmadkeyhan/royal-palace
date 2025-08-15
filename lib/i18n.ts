export type Locale = "en" | "fa"

export interface Translation {
  [key: string]: string | Translation
}

export interface Translations {
  en: Translation
  fa: Translation
}

// Get translation by key with dot notation support
export function getTranslation(translations: Translation, key: string, fallback?: string): string {
  const keys = key.split(".")
  let result: any = translations

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k]
    } else {
      return fallback || key
    }
  }

  return typeof result === "string" ? result : fallback || key
}

// Check if locale is RTL
export function isRTL(locale: Locale): boolean {
  return locale === "fa"
}

// Get opposite locale
export function getOppositeLocale(locale: Locale): Locale {
  return locale === "en" ? "fa" : "en"
}

export function getTranslations(locale: Locale): Translation {
  try {
    if (locale === "fa") {
      return require("../locales/fa.json")
    }
    return require("../locales/en.json")
  } catch (error) {
    console.warn(`Failed to load translations for locale: ${locale}`)
    return {}
  }
}