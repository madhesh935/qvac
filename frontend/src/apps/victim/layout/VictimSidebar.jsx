import { Shield, ChevronLeft } from 'lucide-react';
import { PORTAL_ROUTES } from './portalRoutes';

export default function VictimSidebar({ phase, setPhase, collapsed, onToggle, onSOS }) {
  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-full flex-col border-r border-portal-border bg-[#0a1628] transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      <div className={`flex items-center gap-3 border-b border-portal-border px-4 py-4 ${collapsed ? 'justify-center px-2' : ''}`}>
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: 'linear-gradient(145deg, #EF4444, #B91C1B)' }}
        >
          <Shield className="h-5 w-5 text-white" strokeWidth={2.25} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-white leading-none">ResQMesh</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-400/90 mt-1">
              Victim Portal
            </p>
          </div>
        )}
        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="ml-auto rounded-md p-1.5 text-portal-muted hover:bg-white/5 hover:text-white"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-portal-border bg-[#0a1628] text-portal-muted hover:text-white"
            aria-label="Expand sidebar"
          >
            <ChevronLeft className="h-3 w-3 rotate-180" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5" aria-label="Portal navigation">
        {PORTAL_ROUTES.map(({ id, label, icon: Icon }) => {
          const active = phase === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPhase(id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                active
                  ? 'bg-safety/15 text-white font-semibold border border-safety/25'
                  : 'text-portal-muted hover:bg-white/[0.04] hover:text-portal-text border border-transparent'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-safety' : ''}`} strokeWidth={active ? 2.25 : 2} />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className={`border-t border-portal-border p-3 ${collapsed ? 'px-2' : ''}`}>
        <button
          type="button"
          onClick={onSOS}
          className={`w-full rounded-xl font-bold text-white transition-all touch-target ${
            collapsed ? 'p-3' : 'px-4 py-4'
          }`}
          style={{
            background: 'linear-gradient(180deg, #EF4444 0%, #DC2626 50%, #B91C1B 100%)',
            boxShadow: '0 4px 20px rgba(239,68,68,0.45), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          {collapsed ? (
            <span className="text-xs font-black">SOS</span>
          ) : (
            <>
              <span className="block text-[10px] uppercase tracking-widest text-red-100/80 mb-0.5">SOS</span>
              <span className="block text-sm leading-tight">I NEED HELP</span>
              <span className="block text-[10px] font-medium text-red-100/70 mt-1">Press for SOS</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
