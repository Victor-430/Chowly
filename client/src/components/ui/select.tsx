import * as React from "react"
import { cn } from "@/lib/utils"
import { HiChevronDown } from "react-icons/hi2"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, placeholder, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full appearance-none rounded-input border border-border bg-surface px-3 py-2 pr-10 text-sm ring-offset-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <HiChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
