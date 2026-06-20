import { BookOpen, Users, HeartPulse, Wifi, ChevronRight } from 'lucide-react';
import PortalCard from './PortalCard';

const FEATURES = [
  { id: 'safety', title: 'Safety Guide', desc: 'Flood, fire, earthquake tips', icon: BookOpen, tint: 'from-violet-600/20 to-violet-900/10 border-violet-500/25' },
  { id: 'family', title: 'Family & Sharing', desc: 'Notify loved ones', icon: Users, tint: 'from-safety/20 to-blue-900/10 border-safety/25' },
  { id: 'medical', title: 'Medical Info', desc: 'Blood type, allergies', icon: HeartPulse, tint: 'from-emergency/20 to-red-900/10 border-emergency/25' },
];

export default function FeatureTiles({ onNavigate, online, onSync }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {FEATURES.map(({ id, title, desc, icon: Icon, tint }) => (
        <button
          key={id}
          type="button"
          onClick={() => onNavigate(id)}
          className={`text-left rounded-xl border bg-gradient-to-br p-4 transition-all hover:brightness-110 touch-target ${tint}`}
        >
          <Icon className="w-5 h-5 text-portal-text mb-3" strokeWidth={1.75} />
          <p className="font-semibold text-portal-text text-sm">{title}</p>
          <p className="text-xs text-portal-muted mt-1">{desc}</p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-safety mt-3">
            Open <ChevronRight className="w-3 h-3" />
          </span>
        </button>
      ))}
      <PortalCard padding="p-4" className="flex flex-col justify-between">
        <div className="flex items-start gap-3">
          <Wifi className={`w-5 h-5 shrink-0 ${online ? 'text-success' : 'text-warning'}`} />
          <div>
            <p className="font-semibold text-portal-text text-sm">Offline Status</p>
            <p className="text-xs text-portal-muted mt-1">
              {online ? 'Online · Synced' : 'Offline · Mesh relay active'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSync}
          className="mt-4 w-full py-2 rounded-lg bg-portal-bg border border-portal-border text-xs font-semibold text-portal-text hover:bg-[#151d2e] transition-colors"
        >
          {online ? 'View sync status' : 'Tap to sync'}
        </button>
      </PortalCard>
    </div>
  );
}
