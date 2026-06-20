import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', padding = 'p-5', hover = false, glow }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`rounded-xl border border-portal-border bg-portal-card shadow-[0_4px_24px_rgba(0,0,0,0.25)] ${padding} ${className}`}
      style={glow ? { boxShadow: '0 8px 32px -8px rgba(239,68,68,0.2), 0 4px 16px -4px rgba(0,0,0,0.3)' } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-safety/15 border border-safety/25 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-safety" strokeWidth={2} />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="font-display font-bold text-lg text-portal-text leading-tight">{title}</h2>
          {subtitle && <p className="text-sm text-portal-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
