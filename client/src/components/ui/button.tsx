import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "destructive" | "amber"
  size?: "default" | "sm" | "lg" | "icon"
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
            "h-10 px-4 py-2": size === "default",
            "h-8 px-3 text-sm": size === "sm",
            "h-12 px-6 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
