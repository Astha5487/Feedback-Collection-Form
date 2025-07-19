import React, { Fragment } from "react";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "lucide-react";
import { cn } from "../../lib/utils";

// Dialog component
export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialFocus?: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
  className?: string;
}

const Dialog = ({
  isOpen,
  onClose,
  initialFocus,
  children,
  className,
}: DialogProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog
        as="div"
        className="relative z-50"
        onClose={onClose}
        initialFocus={initialFocus}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel
                className={cn(
                  "w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all",
                  className
                )}
              >
                {children}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
};

// DialogTitle component
export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
  return (
    <HeadlessDialog.Title
      as="h3"
      className={cn(
        "text-lg font-medium leading-6 text-neutral-900 dark:text-neutral-50",
        className
      )}
      {...props}
    />
  );
};

// DialogDescription component
export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
  return (
    <HeadlessDialog.Description
      className={cn(
        "mt-2 text-sm text-neutral-500 dark:text-neutral-400",
        className
      )}
      {...props}
    />
  );
};

// DialogContent component
export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const DialogContent = ({ className, ...props }: DialogContentProps) => {
  return (
    <div
      className={cn(
        "mt-4",
        className
      )}
      {...props}
    />
  );
};

// DialogFooter component
export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  return (
    <div
      className={cn(
        "mt-6 flex justify-end space-x-2",
        className
      )}
      {...props}
    />
  );
};

// DialogCloseButton component
export interface DialogCloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClose?: () => void;
}

const DialogCloseButton = ({ className, onClose, ...props }: DialogCloseButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        "absolute top-4 right-4 inline-flex items-center justify-center rounded-md p-1 text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        className
      )}
      onClick={onClose}
      {...props}
    >
      <span className="sr-only">Close</span>
      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};

export { Dialog, DialogTitle, DialogDescription, DialogContent, DialogFooter, DialogCloseButton };