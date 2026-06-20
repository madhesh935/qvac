export default function Card({
  children,
  className = '',
  padding = 'p-5',
  hover = false,
  variant = 'base',
  ...props
}) {
  const variantClasses = {
    base: 'bg-white border border-slate-100/80 shadow-card',
    elevated: 'bg-white border border-slate-100/80 shadow-elevated',
    subtle: 'bg-slate-50 border border-slate-200/60',
    glass: 'bg-white/80 backdrop-blur-md border border-white/60 shadow-card',
    emergency: 'card-emergency',
    safety: 'card-safety',
    success: 'card-success',
  };

  return (
    <div
      className={`rounded-2xl ${variantClasses[variant]} ${padding} ${
        hover
          ? 'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
