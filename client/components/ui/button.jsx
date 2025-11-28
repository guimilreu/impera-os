import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 mesh-button-primary mesh-accent-hover relative overflow-hidden",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground mesh-button-outline mesh-accent-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 mesh-accent-hover",
  ghost: "hover:bg-accent hover:text-accent-foreground mesh-accent-hover",
  link: "text-primary underline-offset-4 hover:underline",
}

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-full px-3",
  lg: "h-11 rounded-full px-8",
  icon: "h-10 w-10",
}

const buttonVariants = ({ variant = "default", size = "default" } = {}) => {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    variants[variant],
    sizes[size]
  )
}

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

