import { MOBILE_NAV } from './portalRoutes';

export default function MobileBottomNav({ phase, setPhase }) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t border-portal-border bg-[#0a1628]/98 backdrop-blur-lg lg:hidden safe-bottom"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex max-w-lg">
        {MOBILE_NAV.map(({ id, label, icon: Icon }) => {
          const active = phase === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setPhase(id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 touch-target ${
                active ? 'text-safety' : 'text-portal-muted'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 2} />
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
