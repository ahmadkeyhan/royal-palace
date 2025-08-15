"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { getRTLAwareClassName } from "@/lib/rtl-utils"
import type { ReactNode } from "react"
import type { JSX } from "react/jsx-runtime"

interface RTLAwareContainerProps {
  children: ReactNode
  className?: string
  rtlClassName?: string
  ltrClassName?: string
  as?: keyof JSX.IntrinsicElements
}

export function RTLAwareContainer({
  children,
  className = "",
  rtlClassName = "",
  ltrClassName = "",
  as: Component = "div",
}: RTLAwareContainerProps) {
  const { isRTL } = useLanguage()

  const combinedClassName = getRTLAwareClassName(isRTL, className, rtlClassName, ltrClassName)

  return <Component className={combinedClassName}>{children}</Component>
}
