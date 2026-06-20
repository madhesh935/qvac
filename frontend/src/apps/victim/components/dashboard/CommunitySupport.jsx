import { HandHeart } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard, { SectionHeader } from './GlassCard';
import { mockCommunity } from '../../data/emergencyData';

export default function CommunitySupport({ location }) {
  const teams = mockCommunity(location?.latitude, location?.longitude);

  return (
    <GlassCard>
      <SectionHeader
        icon={HandHeart}
        title="Community Assistance"
        subtitle="Volunteers and relief teams in your area"
      />
      <div className="space-y-3">
        {teams.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-[#0a1628] border border-portal-border"
          >
            <div className={`w-3 h-3 rounded-full shrink-0 ${t.active ? 'bg-emerald-500 animate-pulse' : 'bg-portal-muted/50'}`} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-portal-text text-sm">{t.name}</p>
              <p className="text-xs text-portal-muted">{t.role} · {t.dist}</p>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
              t.active ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50' : 'bg-portal-bg text-portal-muted border border-portal-border'
            }`}>
              {t.active ? 'Active' : 'Standby'}
            </span>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
