import React from "react";
import { cn } from "../../lib/utils";

// Form component
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, onSubmit, ...props }, ref) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(e);
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn("space-y-6", className)}
        {...props}
      />
    );
  }
);
Form.displayName = "Form";

// FormSection component
export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, description, titleClassName, descriptionClassName, contentClassName, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-4", className)}
        {...props}
      >
        {(title || description) && (
          <div className="space-y-1">
            {title && (
              <h3 className={cn("text-lg font-medium text-neutral-900 dark:text-neutral-50", titleClassName)}>
                {title}
              </h3>
            )}
            {description && (
              <p className={cn("text-sm text-neutral-500 dark:text-neutral-400", descriptionClassName)}>
                {description}
              </p>
            )}
          </div>
        )}
        <div className={cn("space-y-4", contentClassName)}>
          {children}
        </div>
      </div>
    );
  }
);
FormSection.displayName = "FormSection";

// FormGroup component
export interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: "vertical" | "horizontal";
  labelWidth?: string;
  fieldWidth?: string;
}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, layout = "vertical", labelWidth = "w-1/3", fieldWidth = "w-2/3", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "space-y-2",
          layout === "horizontal" && "sm:flex sm:items-start sm:space-y-0 sm:space-x-4",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            // If it's a label and horizontal layout, add width class
            if (layout === "horizontal" && child.type === "label") {
              return React.cloneElement(child, {
                className: cn(child.props.className, "sm:pt-1.5", labelWidth)
              });
            }
            // If it's the second child (the field) and horizontal layout, add width class
            else if (layout === "horizontal" && index === 1) {
              return React.cloneElement(child, {
                className: cn(child.props.className, fieldWidth)
              });
            }
          }
          return child;
        })}
      </div>
    );
  }
);
FormGroup.displayName = "FormGroup";

// FormActions component
export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "center" | "right" | "between";
}

const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  ({ className, align = "right", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center gap-3 pt-6",
          align === "left" && "justify-start",
          align === "center" && "justify-center",
          align === "right" && "justify-end",
          align === "between" && "justify-between",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FormActions.displayName = "FormActions";

// FormMessage component
export interface FormMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

const FormMessage = React.forwardRef<HTMLDivElement, FormMessageProps>(
  ({ className, type = "info", title, icon, onClose, children, ...props }, ref) => {
    const bgColors = {
      info: "bg-blue-50 dark:bg-blue-900/20",
      success: "bg-green-50 dark:bg-green-900/20",
      warning: "bg-yellow-50 dark:bg-yellow-900/20",
      error: "bg-red-50 dark:bg-red-900/20",
    };

    const borderColors = {
      info: "border-blue-200 dark:border-blue-800",
      success: "border-green-200 dark:border-green-800",
      warning: "border-yellow-200 dark:border-yellow-800",
      error: "border-red-200 dark:border-red-800",
    };

    const textColors = {
      info: "text-blue-800 dark:text-blue-200",
      success: "text-green-800 dark:text-green-200",
      warning: "text-yellow-800 dark:text-yellow-200",
      error: "text-red-800 dark:text-red-200",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "p-4 rounded-md border",
          bgColors[type],
          borderColors[type],
          className
        )}
        {...props}
      >
        <div className="flex">
          {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
          <div className="flex-1">
            {title && (
              <h3 className={cn("text-sm font-medium", textColors[type])}>
                {title}
              </h3>
            )}
            <div className={cn("text-sm", textColors[type])}>
              {children}
            </div>
          </div>
          {onClose && (
            <div className="flex-shrink-0 ml-3">
              <button
                type="button"
                className={cn(
                  "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  textColors[type],
                  `focus:ring-${type === "info" ? "blue" : type === "success" ? "green" : type === "warning" ? "yellow" : "red"}-500`
                )}
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);
FormMessage.displayName = "FormMessage";

export { Form, FormSection, FormGroup, FormActions, FormMessage };