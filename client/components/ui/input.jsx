import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, variant = "default", ...props }, ref) => {
  const variants = {
    default: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out hover:border-ring/50",
    votar: "flex h-10 w-full rounded-none border-0 border-b border-white/30 bg-transparent px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/80 focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-white disabled:cursor-not-allowed disabled:opacity-50",
  }
  
  return (
    <input
      type={type}
      className={cn(
        variants[variant] || variants.default,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

