import * as React from "react"
import { cn } from "../../utils/cn"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
    size?: "sm" | "default" | "lg";
  }
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border-2 border-primary text-primary hover:bg-primary/10",
      ghost: "hover:bg-muted text-foreground",
    };

    const sizeStyles = {
      sm: "h-touch px-4 text-base",
      default: "h-touch-lg px-6 text-base",
      lg: "h-touch-lg px-8 text-lg",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
