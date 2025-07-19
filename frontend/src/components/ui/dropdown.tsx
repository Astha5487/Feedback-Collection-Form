import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "../../lib/utils";

// Dropdown component
export interface DropdownProps {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  align?: "left" | "right";
  width?: "auto" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Dropdown = ({
  trigger,
  children,
  align = "left",
  width = "md",
  className,
}: DropdownProps) => {
  const widthClasses = {
    auto: "w-auto",
    sm: "w-32",
    md: "w-48",
    lg: "w-56",
    xl: "w-64",
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>
        {trigger || (
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-white dark:bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-100 dark:focus:ring-offset-neutral-900"
          >
            Options
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-neutral-400"
              aria-hidden="true"
            />
          </button>
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            "absolute z-10 mt-2 origin-top-right rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            align === "left" ? "left-0" : "right-0",
            widthClasses[width],
            className
          )}
        >
          <div className="py-1">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

// DropdownItem component
export interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  icon?: React.ReactNode;
}

const DropdownItem = ({
  children,
  onClick,
  disabled = false,
  active = false,
  icon,
  className,
  ...props
}: DropdownItemProps) => {
  return (
    <Menu.Item disabled={disabled}>
      {({ active: menuActive }) => (
        <button
          type="button"
          className={cn(
            "flex w-full items-center px-4 py-2 text-sm",
            (active || menuActive) && !disabled
              ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
              : "text-neutral-700 dark:text-neutral-200",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={onClick}
          disabled={disabled}
          {...props}
        >
          {icon && <span className="mr-2 h-4 w-4">{icon}</span>}
          {active && (
            <CheckIcon className="mr-2 h-4 w-4 text-primary-600 dark:text-primary-400" />
          )}
          {children}
        </button>
      )}
    </Menu.Item>
  );
};

// DropdownSeparator component
export interface DropdownSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownSeparator = ({ className, ...props }: DropdownSeparatorProps) => {
  return (
    <div
      className={cn("my-1 h-px bg-neutral-200 dark:bg-neutral-700", className)}
      {...props}
    />
  );
};

// DropdownLabel component
export interface DropdownLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const DropdownLabel = ({ className, ...props }: DropdownLabelProps) => {
  return (
    <div
      className={cn(
        "px-4 py-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider",
        className
      )}
      {...props}
    />
  );
};

export { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel };