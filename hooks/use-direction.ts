"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { useEffect } from "react"

export function useDirection() {
  const { locale, isRTL } = useLanguage()

  useEffect(() => {
    // Update document direction
    document.documentElement.dir = isRTL ? "rtl" : "ltr"
    document.documentElement.lang = locale

    // Update body class for styling
    document.body.classList.toggle("rtl", isRTL)
    document.body.classList.toggle("ltr", !isRTL)
  }, [locale, isRTL])

  return { isRTL, locale }
}
