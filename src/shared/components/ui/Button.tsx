import React from 'react';
import { cn } from '../../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Standard visual variant classes
    const variantClasses: Record<ButtonVariant, string> = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2',
      outline: 'border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2',
      ghost: 'text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-2 focus-visible:ring-slate-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2',
    };

    // Standard size classes
    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-xl',
      icon: 'p-2 rounded-lg aspect-square flex items-center justify-center',
    };

    const isBtnDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isBtnDisabled}
        aria-busy={isLoading ? 'true' : undefined}
        aria-live={isLoading ? 'polite' : undefined}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out',
          'focus:outline-none focus-visible:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className={cn(
              'animate-spin h-5 w-5',
              size !== 'icon' ? 'mr-2' : ''
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            data-testid="spinner"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {/* If icon size and loading, we hide children to show only the spinner. Otherwise, render children. */}
        {size === 'icon' && isLoading ? null : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
