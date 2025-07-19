import React from "react";
import { cn } from "../../lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: RadioOption[];
  name: string;
  value?: string;
  label?: string;
  error?: string;
  orientation?: "horizontal" | "vertical";
  containerClassName?: string;
  labelClassName?: string;
  radioGroupClassName?: string;
  radioItemClassName?: string;
  radioLabelClassName?: string;
  radioDescriptionClassName?: string;
  errorClassName?: string;
  onChange?: (value: string) => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      options,
      name,
      value,
      label,
      error,
      orientation = "vertical",
      containerClassName,
      labelClassName,
      radioGroupClassName,
      radioItemClassName,
      radioLabelClassName,
      radioDescriptionClassName,
      errorClassName,
      onChange,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={cn("space-y-2", containerClassName)} ref={ref} {...props}>
        {label && (
          <label
            className={cn(
              "block text-sm font-medium text-neutral-700 dark:text-neutral-200",
              error && "text-red-500 dark:text-red-400",
              labelClassName
            )}
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "space-y-2",
            orientation === "horizontal" && "flex flex-wrap gap-x-6 gap-y-2 space-y-0",
            radioGroupClassName
          )}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-start",
                option.disabled && "opacity-50 cursor-not-allowed",
                radioItemClassName
              )}
            >
              <div className="flex items-center h-5">
                <input
                  id={`${name}-${option.value}`}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  disabled={option.disabled}
                  onChange={handleChange}
                  className={cn(
                    "h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500 transition-colors",
                    error && "border-red-300 focus:ring-red-500"
                  )}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor={`${name}-${option.value}`}
                  className={cn(
                    "font-medium text-neutral-700 dark:text-neutral-200",
                    option.disabled && "opacity-50 cursor-not-allowed",
                    radioLabelClassName
                  )}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p
                    className={cn(
                      "text-neutral-500 dark:text-neutral-400",
                      option.disabled && "opacity-50",
                      radioDescriptionClassName
                    )}
                  >
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
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
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export { RadioGroup };