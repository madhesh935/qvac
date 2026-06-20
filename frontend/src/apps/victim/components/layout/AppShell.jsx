export default function AppShell({ children, footer }) {
  return (
    <div className="min-h-dvh flex flex-col bg-slate-100" style={{ background: 'linear-gradient(180deg, #F0F2F5 0%, #E8ECF0 100%)' }}>
      {children}
      {footer && (
        <footer className="mt-auto py-5 px-4 text-center safe-bottom">
          <div className="flex items-center justify-center gap-2">
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {footer}
            </p>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
          </div>
          <p className="text-[10px] text-slate-300 mt-1">
            Powered by Mesh Relay Network
          </p>
        </footer>
      )}
    </div>
  );
}
