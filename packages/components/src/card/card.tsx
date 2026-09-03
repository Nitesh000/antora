import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@antora/utilities";

const cardVariants = cva(
  "rounded-xl transition-all duration-medium ease-standard overflow-hidden",
  {
    variants: {
      variant: {
        elevated: "bg-surface-container-high shadow-md hover:shadow-lg",
        filled: "bg-surface-container hover:bg-surface-container-high",
        outlined: "bg-surface border border-outline",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      }
    },
    defaultVariants: {
      variant: "outlined",
      padding: "md"
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card, cardVariants };
