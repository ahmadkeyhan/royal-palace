"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Locale, type Translation, getTranslation, isRTL, getTranslations } from "@/lib/i18n"

interface LanguageContextType {
  locale: Locale
  translations: Translation
  t: (key: string, fallback?: string) => string
  isRTL: boolean
  switchLanguage: (newLocale: Locale) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocale] = useState<Locale>("en")
  const [translations, setTranslations] = useState<Translation>(getTranslations("en"))

  useEffect(() => {
    const savedLocale = localStorage.getItem("language") as Locale
    if (savedLocale && (savedLocale === "en" || savedLocale === "fa")) {
      setLocale(savedLocale)
      setTranslations(getTranslations(savedLocale))
    }
  }, [])

  const t = (key: string, fallback?: string) => {
    return getTranslation(translations, key, fallback)
  }

  const switchLanguage = (newLocale: Locale) => {
    setLocale(newLocale)
    setTranslations(getTranslations(newLocale))
    localStorage.setItem("language", newLocale)

    document.documentElement.dir = isRTL(newLocale) ? "rtl" : "ltr"
    document.documentElement.lang = newLocale
  }

  useEffect(() => {
    document.documentElement.dir = isRTL(locale) ? "rtl" : "ltr"
    document.documentElement.lang = locale
  }, [locale])

  return (
    <LanguageContext.Provider
      value={{
        locale,
        translations,
        t,
        isRTL: isRTL(locale),
        switchLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
