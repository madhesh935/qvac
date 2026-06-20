import {
  LayoutDashboard, Route, Activity, MapPin, HeartPulse, Users,
  BookOpen, Building2, HandHeart, Phone, Wifi, ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DASHBOARD_SECTIONS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, short: 'Home' },
  { id: 'journey', label: 'Journey', icon: Route, short: 'Track' },
  { id: 'updates', label: 'Updates', icon: Activity, short: 'Live' },
  { id: 'location', label: 'Map', icon: MapPin, short: 'Map' },
  { id: 'medical', label: 'Medical', icon: HeartPulse, short: 'Med' },
  { id: 'family', label: 'Family', icon: Users, short: 'Family' },
  { id: 'safety', label: 'Safety', icon: BookOpen, short: 'Guide' },
  { id: 'resources', label: 'Resources', icon: Building2, short: 'Aid' },
  { id: 'community', label: 'Community', icon: HandHeart, short: 'Help' },
  { id: 'contacts', label: 'Contacts', icon: Phone, short: 'Call' },
  { id: 'offline', label: 'Network', icon: Wifi, short: 'Sync' },
];

export default function DashboardNav({ active, onChange }) {
  return (
    <>
      {/* Desktop horizontal nav */}
      <nav
        className="hidden lg:flex gap-1.5 overflow-x-auto pb-1 mb-6 scrollbar-hide"
        aria-label="Dashboard sections"
      >
        {DASHBOARD_SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              active === id
                ? 'bg-emergency text-white shadow-sos'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
            aria-current={active === id ? 'page' : undefined}
          >
            <Icon className="w-4 h-4" strokeWidth={2} />
            {label}
          </button>
        ))}
      </nav>

      {/* Mobile bottom nav - primary 5 + more scroll */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 safe-bottom px-1 pt-1"
        aria-label="Dashboard navigation"
      >
        <div className="flex overflow-x-auto gap-0.5 max-w-lg mx-auto scrollbar-hide">
          {DASHBOARD_SECTIONS.map(({ id, short, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex flex-col items-center justify-center min-w-[4.25rem] py-2 px-1 rounded-xl touch-target transition-colors ${
                active === id ? 'text-emergency' : 'text-slate-500'
              }`}
              aria-current={active === id ? 'page' : undefined}
            >
              <Icon className={`w-5 h-5 ${active === id ? 'text-emergency' : ''}`} strokeWidth={active === id ? 2.5 : 2} />
              <span className="text-[10px] font-bold mt-0.5">{short}</span>
              {active === id && (
                <motion.div layoutId="nav-dot" className="w-1 h-1 rounded-full bg-emergency mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

export function QuickActions({ onSection, onReset }) {
  const actions = [
    { label: 'Update Location', section: 'location', color: 'bg-safety-50 text-safety-700 border-safety-200' },
    { label: 'Share Status', section: 'family', color: 'bg-violet-50 text-violet-700 border-violet-200' },
    { label: 'Emergency Call', section: 'contacts', color: 'bg-red-50 text-red-700 border-red-200' },
    { label: 'Safety Guide', section: 'safety', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { label: 'Find Shelter', section: 'resources', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Track Rescue', section: 'journey', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {actions.map(({ label, section, color }) => (
        <button
          key={section}
          type="button"
          onClick={() => onSection(section)}
          className={`flex items-center justify-between p-4 rounded-2xl border font-semibold text-sm touch-target transition-all hover:shadow-card ${color}`}
        >
          {label}
          <ChevronRight className="w-4 h-4 opacity-50" />
        </button>
      ))}
    </div>
  );
}
