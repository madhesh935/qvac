import {
  Phone, Shield, Flame, Heart, Radio, Truck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard, { SectionHeader } from './GlassCard';
import { EMERGENCY_HOTLINES } from '../../data/emergencyData';

const ICONS = { shield: Shield, flame: Flame, heart: Heart, radio: Radio, truck: Truck, phone: Phone };
const COLORS = {
  blue: 'from-blue-500 to-blue-600',
  orange: 'from-orange-500 to-orange-600',
  green: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  indigo: 'from-indigo-500 to-indigo-600',
  red: 'from-red-500 to-red-600',
};

export default function EmergencyContactsPanel() {
  return (
    <GlassCard glow>
      <SectionHeader
        icon={Phone}
        title="Emergency Contacts"
        subtitle="One tap to reach emergency services"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EMERGENCY_HOTLINES.map((c, i) => {
          const Icon = ICONS[c.icon] || Phone;
          return (
            <motion.a
              key={c.id}
              href={`tel:${c.number}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-2xl p-4 text-white shadow-card touch-target"
              style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${COLORS[c.color]} opacity-100`} />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{c.label}</p>
                  <p className="text-2xl font-black tracking-tight">{c.number}</p>
                  <p className="text-[10px] text-white/70 font-semibold uppercase mt-0.5">{c.status}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center group-hover:bg-white/35 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </GlassCard>
  );
}
