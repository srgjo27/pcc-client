import { cn } from '@/shared/utils/cn';
import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  labelIcon?: React.ReactNode
  leftElement?: React.ReactNode;
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
    labelIcon,
    leftElement,
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
              'text-sm flex items-center gap-1',
              disabled ? 'text-slate-400 cursor-not-allowed' : ''
            )}
          >
            {labelIcon && (
              <span>{labelIcon}</span>
            )}
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              {leftElement}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={ariaDescribedBy}
            className={cn(
              'flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'focus-visible:outline-none focus-visible:ring-1',
              disabled
                ? 'bg-slate-50 text-slate-400 border-neutral-200 cursor-not-allowed'
                : error
                  ? 'border-red-500 text-red-900 focus-visible:ring-red-500 focus-visible:border-transparent'
                  : 'border-neutral-300 focus-visible:ring-[#29B6F6] focus-visible:border-transparent',
              leftElement ? 'pl-10' : '',
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
            className="text-xs text-red-600 animate-fadeIn"
          >
            {error}
          </p>
        ) : helperText && (
          <p
            id={helperId}
            className="text-xs text-slate-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
