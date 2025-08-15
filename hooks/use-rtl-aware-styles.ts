"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import {
  getRTLAwareClassName,
  getDirectionalMargin,
  getDirectionalPadding,
  getDirectionalBorder,
  getDirectionalPosition,
  getFlexDirection,
  getTextAlignment,
  getJustifyContent,
} from "@/lib/rtl-utils"

export function useRTLAwareStyles() {
  const { isRTL } = useLanguage()

  return {
    isRTL,
    getRTLAwareClassName: (baseClassName: string, rtlClassName?: string, ltrClassName?: string) =>
      getRTLAwareClassName(isRTL, baseClassName, rtlClassName, ltrClassName),
    getDirectionalMargin: (side: "start" | "end") => getDirectionalMargin(isRTL, side),
    getDirectionalPadding: (side: "start" | "end") => getDirectionalPadding(isRTL, side),
    getDirectionalBorder: (side: "start" | "end") => getDirectionalBorder(isRTL, side),
    getDirectionalPosition: (side: "start" | "end") => getDirectionalPosition(isRTL, side),
    getFlexDirection: (reverse?: boolean) => getFlexDirection(isRTL, reverse),
    getTextAlignment: (alignment: "start" | "end" | "center") => getTextAlignment(isRTL, alignment),
    getJustifyContent: (justify: "start" | "end" | "center" | "between") => getJustifyContent(isRTL, justify),
  }
}
