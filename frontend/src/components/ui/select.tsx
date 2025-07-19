import React from "react";
import { cn } from "../../lib/utils";
import { ChevronDownIcon } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  selectWrapperClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
  onChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      label,
      helperText,
      error,
      leftIcon,
      containerClassName,
      labelClassName,
      selectWrapperClassName,
      helperTextClassName,
      errorClassName,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

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
            selectWrapperClassName
          )}
        >
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-neutral-500 sm:text-sm">{leftIcon}</span>
            </div>
          )}
          <select
            className={cn(
              "block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm transition-colors appearance-none",
              error && "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500",
              leftIcon && "pl-10",
              props.disabled && "bg-neutral-100 text-neutral-500 cursor-not-allowed",
              className
            )}
            ref={ref}
            onChange={handleChange}
            {...props}
          >
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-neutral-500" />
          </div>
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

Select.displayName = "Select";

export { Select };