import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-border bg-surface-1 px-4 py-2",
          "text-sm text-foreground placeholder:text-muted-foreground",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "hover:border-primary/30",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-2",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
