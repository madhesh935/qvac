import { MapPin, Share2, Phone, BookOpen } from 'lucide-react';

const ACTIONS = [
  { id: 'location', label: 'Update Location', icon: MapPin, bg: 'bg-[#1e3a5f] border-[#2563eb]/40 hover:bg-[#234b73]' },
  { id: 'family', label: 'Share Status', icon: Share2, bg: 'bg-[#14532d] border-[#10b981]/40 hover:bg-[#166534]' },
  { id: 'contacts', label: 'Emergency Contacts', icon: Phone, bg: 'bg-[#7f1d1d] border-[#ef4444]/40 hover:bg-[#991b1b]' },
  { id: 'safety', label: 'Safety Guide', icon: BookOpen, bg: 'bg-[#4c1d95] border-[#8b5cf6]/40 hover:bg-[#5b21b6]' },
];

export default function QuickActionsGrid({ onNavigate }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 h-full">
      {ACTIONS.map(({ id, label, icon: Icon, bg }) => (
        <button
          key={id}
          type="button"
          onClick={() => onNavigate(id)}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 min-h-[88px] transition-colors touch-target ${bg}`}
        >
          <Icon className="w-6 h-6 text-white/90" strokeWidth={1.75} />
          <span className="text-[11px] sm:text-xs font-semibold text-white text-center leading-tight">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
