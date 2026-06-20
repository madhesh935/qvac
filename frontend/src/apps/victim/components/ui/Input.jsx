import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, hint, error, required, className = '', id, prefix: Prefix, suffix: Suffix, ...props },
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
      <div className="relative">
        {Prefix && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Prefix className="w-5 h-5" aria-hidden />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-[52px] ${Prefix ? 'pl-12' : 'pl-4'} ${Suffix ? 'pr-12' : 'pr-4'} 
            bg-[#0a1628] border-2 rounded-2xl text-portal-text text-base
            placeholder:text-portal-muted 
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
        {Suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Suffix className="w-5 h-5" aria-hidden />
          </div>
        )}
      </div>
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-slate-500 leading-relaxed px-1">
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

export default Input;
