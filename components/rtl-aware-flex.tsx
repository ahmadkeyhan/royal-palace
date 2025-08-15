"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { getFlexDirection } from "@/lib/rtl-utils"
import type { ReactNode } from "react"

interface RTLAwareFlexProps {
  children: ReactNode
  className?: string
  direction?: "row" | "col" | "row-reverse" | "col-reverse"
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly"
  align?: "start" | "end" | "center" | "stretch" | "baseline"
  gap?: string
  reverse?: boolean
}

export function RTLAwareFlex({
  children,
  className = "",
  direction = "row",
  justify = "start",
  align = "start",
  gap = "",
  reverse = false,
}: RTLAwareFlexProps) {
  const { isRTL } = useLanguage()

  const flexClasses = ["flex"]

  // Handle direction
  if (direction === "row") {
    flexClasses.push(getFlexDirection(isRTL, reverse))
  } else if (direction === "row-reverse") {
    flexClasses.push(getFlexDirection(isRTL, !reverse))
  } else {
    flexClasses.push(`flex-${direction}`)
  }

  // Handle justify content
  if (justify !== "start") {
    if (justify === "between") flexClasses.push("justify-between")
    else if (justify === "around") flexClasses.push("justify-around")
    else if (justify === "evenly") flexClasses.push("justify-evenly")
    else if (justify === "center") flexClasses.push("justify-center")
    else if (justify === "end") flexClasses.push(isRTL ? "justify-start" : "justify-end")
  } else {
    flexClasses.push(isRTL ? "justify-end" : "justify-start")
  }

  // Handle align items
  if (align === "center") flexClasses.push("items-center")
  else if (align === "end") flexClasses.push("items-end")
  else if (align === "stretch") flexClasses.push("items-stretch")
  else if (align === "baseline") flexClasses.push("items-baseline")
  else flexClasses.push("items-start")

  // Handle gap
  if (gap) flexClasses.push(gap)

  const combinedClassName = `${flexClasses.join(" ")} ${className}`.trim()

  return <div className={combinedClassName}>{children}</div>
}
