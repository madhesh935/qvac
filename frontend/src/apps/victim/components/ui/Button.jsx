import { forwardRef } from 'react';

const variants = {
  primary:
    'btn-sos text-white font-bold disabled:bg-slate-300 disabled:shadow-none disabled:text-slate-500 disabled:transform-none',
  secondary:
    'bg-gradient-to-br from-safety-600 to-safety-700 text-white shadow-safety hover:shadow-lg hover:from-safety-500 hover:to-safety-600 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none disabled:text-slate-500',
  outline:
    'bg-portal-card text-portal-text border-2 border-portal-border hover:border-portal-muted hover:bg-white/[0.04] active:scale-[0.98]',
  ghost: 'bg-transparent text-portal-muted hover:bg-white/[0.05] hover:text-portal-text active:scale-[0.98]',
  danger:
    'bg-red-50 text-emergency border border-red-200 hover:bg-red-100 active:scale-[0.98]',
  success:
    'bg-gradient-to-br from-success-500 to-success-600 text-white shadow-success hover:shadow-lg active:scale-[0.98]',
};

const sizes = {
  sm: 'h-10 px-4 text-sm rounded-xl gap-1.5',
  md: 'h-12 px-5 text-base rounded-2xl gap-2',
  lg: 'h-[52px] px-6 text-base rounded-2xl gap-2.5 font-semibold',
  xl: 'h-[60px] px-8 text-lg rounded-3xl gap-3 font-bold',
  '2xl': 'h-[72px] px-10 text-xl rounded-3xl gap-3 font-bold',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', children, loading, icon: Icon, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center transition-all duration-200 touch-target select-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-5 h-5 shrink-0" strokeWidth={2.25} aria-hidden />
      ) : null}
      {children}
    </button>
  );
});

export default Button;
