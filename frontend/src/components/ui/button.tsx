import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// Define button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles that apply to all button variants
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
        secondary: "bg-secondary-600 text-white hover:bg-secondary-700 shadow-sm",
        accent: "bg-accent-500 text-white hover:bg-accent-600 shadow-sm",
        outline: "border border-neutral-300 bg-transparent hover:bg-neutral-100 text-neutral-900 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800",
        ghost: "bg-transparent hover:bg-neutral-100 text-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800",
        link: "bg-transparent underline-offset-4 hover:underline text-primary-600 dark:text-primary-400 hover:bg-transparent",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
      isLoading: {
        true: "relative text-transparent transition-none hover:text-transparent",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isLoading: false,
    },
  }
);

// Define the props for our Button component
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

// Create the Button component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, isLoading, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        )}
        {leftIcon && <span className={cn("mr-2", { "opacity-0": isLoading })}>{leftIcon}</span>}
        <span className={isLoading ? "opacity-0" : ""}>{children}</span>
        {rightIcon && <span className={cn("ml-2", { "opacity-0": isLoading })}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };