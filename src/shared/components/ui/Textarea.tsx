import React, { useId } from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className,
    label,
    error,
    helperText,
    disabled,
    id,
    ...props
  }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    // Determine aria-describedby based on error or helper text presence
    const ariaDescribedBy = cn(
      error ? errorId : undefined,
      helperText && !error ? helperId : undefined
    ) || undefined;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'text-sm font-medium',
              disabled && 'text-slate-400 cursor-not-allowed'
            )}
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={ariaDescribedBy}
          className={cn(
            'flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-xs',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2',
            disabled
              ? 'bg-slate-50 text-slate-400 border-neutral-200 cursor-not-allowed'
              : error
                ? 'border-red-500 text-red-900 focus-visible:ring-red-500 focus-visible:border-transparent'
                : 'border-neutral-300 focus-visible:ring-[#29B6F6] focus-visible:border-transparent',
            className
          )}
          {...props}
        />
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-red-600 animate-fadeIn"
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

Textarea.displayName = 'Textarea';
export default Textarea;
