import { Building2, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard, { SectionHeader } from './GlassCard';
import { mockResources } from '../../data/emergencyData';

export default function ResourceCenters({ location }) {
  const resources = mockResources(location?.latitude, location?.longitude);

  if (!location) {
    return (
      <GlassCard>
        <SectionHeader icon={Building2} title="Resource Centers" subtitle="Enable GPS to see nearby aid" />
        <p className="text-sm text-portal-muted text-center py-8">Location required to show nearby shelters and aid stations.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <SectionHeader
        icon={Building2}
        title="Resource Centers"
        subtitle="Shelters, hospitals, and relief points near you"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {resources.map((r, i) => (
          <motion.a
            key={r.id}
            href={`https://www.openstreetmap.org/?mlat=${r.lat}&mlon=${r.lng}&zoom=16`}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="flex gap-3 p-4 rounded-2xl bg-[#0a1628] border border-portal-border hover:border-safety/40 transition-all"
          >
            <span className="text-2xl">{r.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-safety">{r.type}</p>
              <p className="font-semibold text-sm text-portal-text truncate">{r.name}</p>
              <p className="text-xs text-portal-muted mt-1">{r.dist} · {r.avail}</p>
            </div>
            <Navigation className="w-4 h-4 text-portal-muted shrink-0 mt-1" />
          </motion.a>
        ))}
      </div>
    </GlassCard>
  );
}
