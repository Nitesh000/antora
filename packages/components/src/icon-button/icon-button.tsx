import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@antora/utilities";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96]",
  {
    variants: {
      variant: {
        filled: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md",
        tonal: "bg-secondary-container text-secondary-container-foreground hover:bg-secondary-container/80",
        outlined: "border border-outline bg-transparent hover:bg-surface-container",
        standard: "bg-transparent hover:bg-surface-container text-on-surface",
      },
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "standard",
      size: "default",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
