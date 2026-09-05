import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { HiXMark } from "react-icons/hi2"

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined)

function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("Dialog components must be used within a Dialog")
  return context
}

export function Dialog({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) {
  const { onOpenChange } = useDialog()
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      onClick: () => onOpenChange(true)
    })
  }

  return <button onClick={() => onOpenChange(true)}>{children}</button>
}

export function DialogContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, onOpenChange } = useDialog()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [open, onOpenChange])

  return (
    <AnimatePresence>
      {open && (
        <DialogPortal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "relative z-50 grid w-full max-w-lg gap-4 bg-surface p-6 shadow-lg sm:rounded-card",
                className
              )}
            >
              {children}
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber focus:ring-offset-2 disabled:pointer-events-none">
                <HiXMark className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </motion.div>
          </motion.div>
        </DialogPortal>
      )}
    </AnimatePresence>
  )
}

function DialogPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) return null
  return createPortal(children, document.body)
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
  )
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  )
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-text-secondary", className)} {...props} />
  )
}

export function DialogClose({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onOpenChange } = useDialog()
  return (
    <button type="button" onClick={() => onOpenChange(false)} className={className} {...props}>
      {children}
    </button>
  )
}
