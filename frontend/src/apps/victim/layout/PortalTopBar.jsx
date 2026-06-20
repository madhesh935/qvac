import { useState, useEffect } from 'react';
import { Menu, Bell, Signal, Battery, Wifi } from 'lucide-react';
import { ROUTE_TITLES } from './portalRoutes';

export default function PortalTopBar({
  phase,
  online,
  backendConnected,
  socketConnected,
  sidebarCollapsed,
  onMenuOpen,
  report,
  onStatusClick,
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const title = ROUTE_TITLES[phase] || 'ResQMesh Victim Portal';

  const live = backendConnected !== false && socketConnected;
  const statusLabel = !online
    ? 'Offline'
    : backendConnected === false
      ? 'No backend'
      : !socketConnected
        ? 'Connecting…'
        : 'Live';

  return (
    <header
      className={`fixed top-0 right-0 left-0 lg:left-auto z-40 flex h-14 items-center gap-4 border-b border-portal-border bg-[#0c1829]/95 px-4 backdrop-blur-md transition-all duration-300 ${
        sidebarCollapsed ? 'lg:left-[72px]' : 'lg:left-[260px]'
      }`}
    >
      <button
        type="button"
        onClick={onMenuOpen}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-portal-border text-portal-text lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-sm font-bold text-portal-text sm:text-base">{title}</h1>
        <p className="hidden text-[11px] text-portal-muted sm:block">ResQMesh Victim Portal</p>
      </div>

      <div className="hidden items-center gap-4 text-portal-muted md:flex">
        <div className="text-right tabular-nums">
          <p className="text-sm font-semibold text-portal-text">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-[10px]">
            {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div
        className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold sm:flex ${
          live
            ? 'border-success/30 bg-success/10 text-emerald-400'
            : online
              ? 'border-warning/30 bg-warning/10 text-amber-400'
              : 'border-warning/30 bg-warning/10 text-amber-400'
        }`}
        title={live ? 'Connected to backend via Socket.IO' : 'Waiting for backend connection'}
      >
        <Wifi className="h-3 w-3" />
        {statusLabel}
      </div>

      <Signal className="hidden h-4 w-4 text-portal-muted sm:block" aria-hidden />
      <div className="hidden items-center gap-1 text-[11px] text-portal-muted sm:flex">
        <Battery className="h-4 w-4" />
        <span className="tabular-nums">72%</span>
      </div>

      {report && (
        <button
          type="button"
          onClick={onStatusClick}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-portal-border text-portal-text hover:bg-white/5"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emergency ring-2 ring-[#0c1829]" />
        </button>
      )}

      <div
        className="flex h-9 w-9 items-center justify-center rounded-full border border-portal-border bg-gradient-to-br from-safety/30 to-safety/10 text-xs font-bold text-white"
        aria-hidden
      >
        V
      </div>
    </header>
  );
}
