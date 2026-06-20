export default function PortalCard({
  children,
  className = '',
  padding = 'p-5',
  hover = false,
  accent,
}) {
  return (
    <div
      className={`rounded-xl border bg-portal-card ${padding} ${hover ? 'transition-colors hover:border-portal-border/80 hover:bg-[#151d2e]' : ''} ${
        accent ? 'border-emergency/30' : 'border-portal-border'
      } ${className}`}
      style={{
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      {children}
    </div>
  );
}

export function PortalSectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <h3 className="text-sm font-semibold text-portal-text tracking-tight">{children}</h3>
      {action}
    </div>
  );
}
