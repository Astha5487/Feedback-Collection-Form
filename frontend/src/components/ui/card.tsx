import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// Define card variants using class-variance-authority
const cardVariants = cva(
  "rounded-lg overflow-hidden transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm",
        elevated: "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-md hover:shadow-lg",
        filled: "bg-neutral-100 dark:bg-neutral-900 border border-transparent",
        outline: "bg-transparent border border-neutral-200 dark:border-neutral-700",
        glass: "bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-white/20 dark:border-neutral-700/30 shadow-sm",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        "3xl": "rounded-3xl",
        full: "rounded-full",
      },
      hover: {
        true: "hover:-translate-y-1 hover:shadow-md",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      radius: "lg",
      hover: false,
    },
  }
);

// Card component
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, radius, hover, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, radius, hover, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

// Card Header component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("px-6 py-5 border-b border-neutral-200 dark:border-neutral-700", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

// Card Title component
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        className={cn("text-lg font-semibold text-neutral-900 dark:text-neutral-50", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

// Card Description component
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean;
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
CardDescription.displayName = "CardDescription";

// Card Content component
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("px-6 py-5", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

// Card Footer component
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };