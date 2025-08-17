"use client"

import { useDirection } from "@/hooks/use-direction"
import { useLanguage } from "@/contexts/LanguageContext"
import type { ReactNode } from "react"

interface LayoutWrapperProps {
  children: ReactNode
  className?: string
}

export function LayoutWrapper({ children, className = "" }: LayoutWrapperProps) {
  const { isRTL } = useDirection()
  const { locale } = useLanguage()

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      lang={locale}
      className={`min-h-screen pt-[72px] min-[1200px]:pt-[102px] transition-all duration-300 ${isRTL ? "font-doran" : "font-miracle"} ${className}`}
    >
      {children}
    </div>
  )
}
