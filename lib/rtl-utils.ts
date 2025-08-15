export interface RTLAwareProps {
  className?: string
  rtlClassName?: string
  ltrClassName?: string
}

export function getRTLAwareClassName(isRTL: boolean, baseClassName = "", rtlClassName = "", ltrClassName = ""): string {
  const classes = [baseClassName]

  if (isRTL && rtlClassName) {
    classes.push(rtlClassName)
  } else if (!isRTL && ltrClassName) {
    classes.push(ltrClassName)
  }

  return classes.filter(Boolean).join(" ")
}

export function getDirectionalMargin(isRTL: boolean, side: "start" | "end"): string {
  if (side === "start") {
    return isRTL ? "mr-" : "ml-"
  } else {
    return isRTL ? "ml-" : "mr-"
  }
}

export function getDirectionalPadding(isRTL: boolean, side: "start" | "end"): string {
  if (side === "start") {
    return isRTL ? "pr-" : "pl-"
  } else {
    return isRTL ? "pl-" : "pr-"
  }
}

export function getDirectionalBorder(isRTL: boolean, side: "start" | "end"): string {
  if (side === "start") {
    return isRTL ? "border-r" : "border-l"
  } else {
    return isRTL ? "border-l" : "border-r"
  }
}

export function getDirectionalPosition(isRTL: boolean, side: "start" | "end"): string {
  if (side === "start") {
    return isRTL ? "right-" : "left-"
  } else {
    return isRTL ? "left-" : "right-"
  }
}

// Utility for handling flex direction in RTL
export function getFlexDirection(isRTL: boolean, reverse = false): string {
  if (reverse) {
    return isRTL ? "flex-row" : "flex-row-reverse"
  }
  return isRTL ? "flex-row-reverse" : "flex-row"
}

// Utility for handling text alignment
export function getTextAlignment(isRTL: boolean, alignment: "start" | "end" | "center"): string {
  if (alignment === "center") return "text-center"
  if (alignment === "start") return isRTL ? "text-right" : "text-left"
  if (alignment === "end") return isRTL ? "text-left" : "text-right"
  return ""
}

// Utility for handling justify content
export function getJustifyContent(isRTL: boolean, justify: "start" | "end" | "center" | "between"): string {
  if (justify === "center") return "justify-center"
  if (justify === "between") return "justify-between"
  if (justify === "start") return isRTL ? "justify-end" : "justify-start"
  if (justify === "end") return isRTL ? "justify-start" : "justify-end"
  return ""
}
