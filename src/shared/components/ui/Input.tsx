import React, { useId } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className,
    type = 'text',
    label,
    error,
    helperText,
    disabled,
    id,
    rightElement,
    ...props
  }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Determine aria-describedby based on error or helper text presence
    const ariaDescribedBy = cn(
      error ? errorId : undefined,
      helperText && !error ? helperId : undefined
    ) || undefined;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium',
              disabled ? 'text-slate-400 cursor-not-allowed' : ''
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={ariaDescribedBy}
            className={cn(
              'flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-base',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2',
              disabled
                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                : error
                  ? 'border-red-500 text-red-900 focus-visible:ring-red-500 focus-visible:border-transparent'
                  : 'border-neutral-300 focus-visible:ring-blue-500 focus-visible:border-transparent',
              rightElement ? 'pr-10' : '',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-red-600 animate-fadeIn"
          >
            {error}
          </p>
        ) : helperText ? (
          <p
            id={helperId}
            className="text-xs text-slate-500"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
