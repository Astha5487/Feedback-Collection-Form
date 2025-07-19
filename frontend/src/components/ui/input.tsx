import React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      containerClassName,
      labelClassName,
      inputWrapperClassName,
      helperTextClassName,
      errorClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "block text-sm font-medium text-neutral-700 dark:text-neutral-200",
              error && "text-red-500 dark:text-red-400",
              labelClassName
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div
          className={cn(
            "relative rounded-md shadow-sm",
            inputWrapperClassName
          )}
        >
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-neutral-500 sm:text-sm">{leftIcon}</span>
            </div>
          )}
          <input
            type={type}
            className={cn(
              "block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm transition-colors",
              error && "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              props.disabled && "bg-neutral-100 text-neutral-500 cursor-not-allowed",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-neutral-500 sm:text-sm">{rightIcon}</span>
            </div>
          )}
        </div>
        {helperText && !error && (
          <p
            className={cn(
              "text-sm text-neutral-500 dark:text-neutral-400",
              helperTextClassName
            )}
          >
            {helperText}
          </p>
        )}
        {error && (
          <p
            className={cn(
              "text-sm text-red-600 dark:text-red-400",
              errorClassName
            )}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };