import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error" | "info" | "amber"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2",
        {
          "bg-charcoal text-white": variant === "default",
          "bg-border-light text-text-secondary": variant === "secondary",
          "bg-success-light text-success": variant === "success",
          "bg-warning-light text-warning": variant === "warning",
          "bg-error-light text-error": variant === "error",
          "bg-info-light text-info": variant === "info",
          "bg-amber-light text-amber": variant === "amber",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
