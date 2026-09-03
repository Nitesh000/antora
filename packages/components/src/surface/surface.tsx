import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@antora/utilities";

const surfaceVariants = cva(
  "transition-colors",
  {
    variants: {
      variant: {
        main: "bg-surface text-on-surface",
        container: "bg-surface-container text-on-surface",
        containerHigh: "bg-surface-container-high text-on-surface",
      },
      shape: {
        square: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "main",
      shape: "square"
    },
  }
);

export interface SurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {}

const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant, shape, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(surfaceVariants({ variant, shape, className }))}
        {...props}
      />
    );
  }
);
Surface.displayName = "Surface";

export { Surface, surfaceVariants };
