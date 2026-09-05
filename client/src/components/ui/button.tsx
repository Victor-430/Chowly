import * as React from "react"
import { cn } from "@/lib/utils"

export type ButtonSize = "default" | "sm" | "lg" | "icon"

export type ResponsiveSizeMap = {
  default?: ButtonSize
  base?: ButtonSize
  sm?: ButtonSize
  md?: ButtonSize
  lg?: ButtonSize
  xl?: ButtonSize
}

export type ResponsiveButtonSize = ButtonSize | ResponsiveSizeMap | (string & {})

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "destructive" | "amber"
  size?: ResponsiveButtonSize
}

const sizeClasses: Record<"base" | "sm" | "md" | "lg" | "xl", Record<ButtonSize, string>> = {
  base: {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 p-0",
  },
  sm: {
    default: "sm:h-10 sm:px-4 sm:py-2 sm:text-sm",
    sm: "sm:h-8 sm:px-3 sm:text-xs",
    lg: "sm:h-12 sm:px-6 sm:text-base",
    icon: "sm:h-10 sm:w-10 sm:p-0",
  },
  md: {
    default: "md:h-10 md:px-4 md:py-2 md:text-sm",
    sm: "md:h-8 md:px-3 md:text-xs",
    lg: "md:h-12 md:px-6 md:text-base",
    icon: "md:h-10 md:w-10 md:p-0",
  },
  lg: {
    default: "lg:h-10 lg:px-4 lg:py-2 lg:text-sm",
    sm: "lg:h-8 lg:px-3 lg:text-xs",
    lg: "lg:h-12 lg:px-6 lg:text-base",
    icon: "lg:h-10 lg:w-10 lg:p-0",
  },
  xl: {
    default: "xl:h-10 xl:px-4 xl:py-2 xl:text-sm",
    sm: "xl:h-8 xl:px-3 xl:text-xs",
    lg: "xl:h-12 xl:px-6 xl:text-base",
    icon: "xl:h-10 xl:w-10 xl:p-0",
  },
}

function resolveSizeClasses(size: ResponsiveButtonSize = "default"): string {
  if (!size) return sizeClasses.base.default

  // 1. If string is passed
  if (typeof size === "string") {
    // Check if it is a responsive string like "sm md:default lg:lg"
    if (size.includes(" ") || size.includes(":")) {
      return size
        .trim()
        .split(/\s+/)
        .map((part) => {
          if (part.includes(":")) {
            const [bp, s] = part.split(":") as [keyof typeof sizeClasses, ButtonSize]
            if (sizeClasses[bp] && sizeClasses[bp][s]) {
              return sizeClasses[bp][s]
            }
          } else if (sizeClasses.base[part as ButtonSize]) {
            return sizeClasses.base[part as ButtonSize]
          }
          return ""
        })
        .filter(Boolean)
        .join(" ")
    }
    // Single static size string like "sm", "default", "lg", "icon"
    return sizeClasses.base[size as ButtonSize] || sizeClasses.base.default
  }

  // 2. If object is passed: e.g. { default: 'sm', md: 'default', lg: 'lg' }
  const classes: string[] = []
  const baseSize = size.base || size.default
  if (baseSize && sizeClasses.base[baseSize]) {
    classes.push(sizeClasses.base[baseSize])
  } else if (!baseSize) {
    classes.push(sizeClasses.base.default)
  }

  const breakpoints: ("sm" | "md" | "lg" | "xl")[] = ["sm", "md", "lg", "xl"]
  for (const bp of breakpoints) {
    const bpSize = size[bp]
    if (bpSize && sizeClasses[bp][bpSize]) {
      classes.push(sizeClasses[bp][bpSize])
    }
  }

  return classes.join(" ")
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-button font-medium ring-offset-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-charcoal text-white hover:bg-charcoal/90": variant === "default",
            "bg-warm-white border border-border text-charcoal hover:bg-border-light": variant === "secondary",
            "bg-transparent hover:bg-border-light": variant === "ghost",
            "bg-error text-white hover:bg-error/90": variant === "destructive",
            "bg-amber text-white hover:bg-amber/90": variant === "amber",
          },
          resolveSizeClasses(size),
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
