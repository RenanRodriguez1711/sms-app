import * as React from "react"
import { cn } from "../../utils/cn"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline";
  }
>(
  (
    { className, variant = "default", ...props },
    ref
  ) => {
    const variantStyles = {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-muted text-muted-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      outline: "border-2 border-border text-foreground",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-4 py-1.5 text-base font-semibold",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
