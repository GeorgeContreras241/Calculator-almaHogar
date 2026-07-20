import * as React from "react"
import { cn } from "../../lib/utils"

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; onValueChange: (value: string) => void }
>(({ className, value, onValueChange, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, { value, onValueChange })
      }
      return child
    })}
  </div>
))
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-muted)] p-1 text-[var(--color-muted-foreground)]",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; currentValue?: string; onValueChange?: (value: string) => void }
>(({ className, value, currentValue, onValueChange, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
      currentValue === value && "bg-[var(--color-background)] text-[var(--color-foreground)] shadow-sm",
      className
    )}
    onClick={() => onValueChange?.(value)}
    {...props}
  >
    {children}
  </button>
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; currentValue?: string }
>(({ className, value, currentValue, children, ...props }, ref) => {
  if (value !== currentValue) return null
  return (
    <div
      ref={ref}
      className={cn("mt-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ring)]", className)}
      {...props}
    >
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
