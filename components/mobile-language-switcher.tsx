"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { getOppositeLocale } from "@/lib/i18n"

interface MobileLanguageSwitcherProps {
  className?: string
}

export function MobileLanguageSwitcher({ className = "" }: MobileLanguageSwitcherProps) {
  const { locale, switchLanguage } = useLanguage()

  const handleToggle = () => {
    switchLanguage(getOppositeLocale(locale))
  }

  const currentFlag = locale === "en" ? "🇺🇸" : "🇮🇷"
  const currentLabel = locale === "en" ? "EN" : "فا"

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className={`h-10 px-3 gap-2 bg-regal_green text-sm font-medium hover:bg-golden_yellow hover:text-accent-foreground ${className}`}
    >
      <Globe className="h-4 w-4" />
      {/* <span className="text-lg mr-1">{currentFlag}</span> */}
      <span>{currentLabel}</span>
    </Button>
  )
}
