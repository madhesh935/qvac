const PRIORITY_CONFIG = {
  CRITICAL: {
    cls: 'bg-red-600 text-white shadow-sm',
    dot: 'bg-red-300',
    label: 'CRITICAL',
  },
  HIGH: {
    cls: 'bg-orange-500 text-white shadow-sm',
    dot: 'bg-orange-300',
    label: 'HIGH',
  },
  MEDIUM: {
    cls: 'bg-amber-400 text-amber-900 shadow-sm',
    dot: 'bg-amber-600',
    label: 'MEDIUM',
  },
  LOW: {
    cls: 'bg-emerald-500 text-white shadow-sm',
    dot: 'bg-emerald-200',
    label: 'LOW',
  },
  PENDING: {
    cls: 'bg-slate-200 text-slate-600',
    dot: 'bg-slate-400',
    label: 'PENDING',
  },
};

const STATUS_CONFIG = {
  PENDING: {
    cls: 'bg-slate-100 text-slate-600 border border-slate-200',
    dot: 'bg-slate-400',
    label: 'Pending Review',
    pulse: false,
  },
  ASSIGNED: {
    cls: 'bg-blue-100 text-blue-800 border border-blue-200',
    dot: 'bg-blue-500',
    label: 'Team Assigned',
    pulse: true,
  },
  EN_ROUTE: {
    cls: 'bg-amber-100 text-amber-800 border border-amber-200',
    dot: 'bg-amber-500',
    label: 'En Route',
    pulse: true,
  },
  RESOLVED: {
    cls: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Resolved',
    pulse: false,
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs rounded-full gap-1',
  md: 'px-3 py-1 text-xs rounded-full gap-1.5',
  lg: 'px-3.5 py-1.5 text-sm rounded-full gap-2 font-bold',
  xl: 'px-4 py-2 text-base rounded-full gap-2 font-bold',
};

export function PriorityBadge({ priority, size = 'md' }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.PENDING;
  const sz = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wide ${config.cls} ${sz}`}
      role="status"
      aria-label={`Priority: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} aria-hidden />
      {config.label}
    </span>
  );
}

export default function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const sz = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center font-semibold ${config.cls} ${sz}`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0 ${
          config.pulse ? 'animate-pulse' : ''
        }`}
        aria-hidden
      />
      {config.label}
    </span>
  );
}
