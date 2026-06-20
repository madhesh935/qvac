import { AlertTriangle, Info, CheckCircle2, XCircle, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const configs = {
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    title: 'text-blue-900',
    iconColor: 'text-safety-600',
    iconBg: 'bg-blue-100',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    title: 'text-amber-900',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
  },
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    title: 'text-emerald-900',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    title: 'text-red-900',
    iconColor: 'text-emergency',
    iconBg: 'bg-red-100',
  },
  offline: {
    icon: WifiOff,
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    title: 'text-slate-900',
    iconColor: 'text-slate-500',
    iconBg: 'bg-slate-100',
  },
  syncing: {
    icon: Loader2,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    title: 'text-amber-900',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
  },
};

export default function Alert({
  variant = 'info',
  title,
  children,
  className = '',
  animate = false,
}) {
  const { icon: Icon, bg, border, text, title: titleCls, iconColor, iconBg } = configs[variant];

  const content = (
    <div
      className={`flex gap-3 p-4 rounded-2xl border ${bg} ${border} ${className}`}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon
          className={`w-5 h-5 ${iconColor} ${variant === 'syncing' ? 'animate-spin' : ''}`}
          aria-hidden
        />
      </div>
      <div className={`flex-1 min-w-0`}>
        {title && (
          <p className={`font-bold text-sm mb-0.5 ${titleCls}`}>{title}</p>
        )}
        <div className={`text-sm leading-relaxed ${text}`}>{children}</div>
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
