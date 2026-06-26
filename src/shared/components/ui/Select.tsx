import { cn } from '@/shared/utils/cn';
import { ChevronDown } from 'lucide-react';
import React, { useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  labelIcon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className,
    label,
    error,
    helperText,
    disabled,
    id,
    options = [],
    children,
    labelIcon,
    ...props
  }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    // Determine aria-describedby based on error or helper text presence
    const ariaDescribedBy = cn(
      error ? errorId : undefined,
      helperText && !error ? helperId : undefined
    ) || undefined;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'text-sm flex items-center gap-1',
              disabled && 'text-slate-400 cursor-not-allowed'
            )}
          >
            {labelIcon && (
              <span>{labelIcon}</span>
            )}
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={ariaDescribedBy}
            className={cn(
              'appearance-none',
              'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2',
              disabled
                ? 'bg-slate-50 text-slate-400 border-neutral-200 cursor-not-allowed'
                : error
                  ? 'border-red-500 text-red-900 focus-visible:ring-red-500 focus-visible:border-transparent'
                  : 'border-neutral-300 focus-visible:ring-blue-500 focus-visible:border-transparent',
              className
            )}
            {...props}
          >
            {children || options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-transform duration-200"
          />
        </div>
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

Select.displayName = 'Select';
export default Select;
