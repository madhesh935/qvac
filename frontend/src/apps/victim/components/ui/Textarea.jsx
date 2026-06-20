import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, hint, error, required, className = '', id, rows = 4, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-portal-text">
          {label}
          {required && (
            <span className="text-emergency ml-1 font-bold" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`w-full px-4 py-3.5 bg-[#0a1628] border-2 rounded-2xl text-portal-text text-base
          placeholder:text-portal-muted resize-none leading-relaxed
          transition-all duration-200
          focus:bg-[#0d1a30] focus:outline-none focus:ring-0
          ${error
            ? 'border-emergency/60 focus:border-emergency bg-red-950/30'
            : 'border-portal-border focus:border-safety hover:border-portal-muted'
          }
          ${className}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        {...props}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-portal-muted leading-relaxed px-1">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${inputId}-error`}
          className="flex items-center gap-1.5 text-sm text-emergency font-medium px-1"
          role="alert"
        >
          <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full bg-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emergency" />
          </span>
          {error}
        </p>
      )}
    </div>
  );
});

export default Textarea;
