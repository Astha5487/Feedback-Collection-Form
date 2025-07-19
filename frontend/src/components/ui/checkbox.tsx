import React from "react";
import { cn } from "../../lib/utils";
import { CheckIcon } from "lucide-react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  onChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      error,
      containerClassName,
      labelClassName,
      descriptionClassName,
      errorClassName,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.checked);
      }
    };

    return (
      <div className={cn("flex", containerClassName)}>
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              type="checkbox"
              className={cn(
                "h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 transition-colors",
                error && "border-red-300 focus:ring-red-500",
                props.disabled && "opacity-50 cursor-not-allowed",
                className
              )}
              ref={ref}
              onChange={handleChange}
              {...props}
            />
            {props.checked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <CheckIcon className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label
                htmlFor={props.id}
                className={cn(
                  "font-medium text-neutral-700 dark:text-neutral-200",
                  error && "text-red-500 dark:text-red-400",
                  props.disabled && "opacity-50 cursor-not-allowed",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p
                className={cn(
                  "text-neutral-500 dark:text-neutral-400",
                  props.disabled && "opacity-50",
                  descriptionClassName
                )}
              >
                {description}
              </p>
            )}
            {error && (
              <p
                className={cn(
                  "mt-1 text-sm text-red-600 dark:text-red-400",
                  errorClassName
                )}
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };