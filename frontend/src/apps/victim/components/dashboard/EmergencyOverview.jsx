import { motion } from 'framer-motion';
import {
  Shield, Clock, MapPin, Radio, Truck, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import StatusBadge, { PriorityBadge } from '../ui/Badge';
import ResponsePanel from '../ResponsePanel';
import Alert from '../ui/Alert';
import GlassCard from './GlassCard';
import { estimateEta } from '../../hooks/useVictimProfile';

export default function EmergencyOverview({ report, location, latestUpdate }) {
  if (!report) return null;
  const rid = (report._id || report.packet_id || '').toString().slice(-8).toUpperCase();
  const eta = estimateEta(report);
  const teamName = report.status === 'ASSIGNED' ? 'Rescue Team Alpha' : 'Awaiting assignment';

  return (
    <div className="space-y-4">
      {/* Premium hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl shadow-elevated"
        style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 45%, #991B1B 100%)' }}
      >
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 40%)',
        }} />
        <div className="relative px-5 py-6 sm:px-6 sm:py-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 rounded-full px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white">Help Is Coming</span>
            </div>
            <PriorityBadge priority={report.priority} size="md" />
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white leading-tight mb-2">
            You Are Not Alone
          </h1>
          <p className="text-red-100 text-sm sm:text-base max-w-md leading-relaxed">
            {report.status === 'ASSIGNED'
              ? `${teamName} has been assigned. Stay where you are — rescue is on the way.`
              : 'Your emergency report is active. Rescue teams are coordinating your response.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Status', value: <StatusBadge status={report.status} size="sm" />, raw: false },
              { label: 'Priority', value: report.priority, raw: true },
              { label: 'ETA', value: eta, raw: true, icon: Clock },
              { label: 'Team', value: teamName.split(' ').slice(-2).join(' '), raw: true, icon: Truck },
            ].map(({ label, value, raw, icon: Icon }) => (
              <div key={label} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-3 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-200/80 mb-1">{label}</p>
                {raw ? (
                  <div className="flex items-center gap-1.5">
                    {Icon && <Icon className="w-3.5 h-3.5 text-white/70" />}
                    <span className="text-sm font-bold text-white truncate">{value}</span>
                  </div>
                ) : value}
              </div>
            ))}
          </div>

          {location && (
            <div className="mt-4 flex items-center gap-2 bg-black/20 rounded-xl px-4 py-2.5 border border-white/10">
              <MapPin className="w-4 h-4 text-red-200 shrink-0" />
              <span className="font-mono text-xs text-white/90 truncate">
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </span>
            </div>
          )}

          {latestUpdate && (
            <div className="mt-4 bg-white/10 backdrop-blur rounded-xl px-4 py-3 border border-white/15">
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4 text-white/80" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-200">Latest Update</span>
              </div>
              <p className="text-sm text-white font-medium leading-relaxed">{latestUpdate}</p>
            </div>
          )}
        </div>

        <div className="relative bg-black/25 border-t border-white/10 px-5 py-2.5 flex justify-between items-center">
          <span className="font-mono text-xs font-bold text-white/90 tracking-widest">ID #{rid}</span>
          <span className="text-[10px] text-white/50 flex items-center gap-1">
            <Shield className="w-3 h-3" /> ResQMesh Emergency Network
          </span>
        </div>
      </motion.div>

      {/* Reassurance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Shield, title: 'Safe', desc: 'Your report is in the national response system', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
          { icon: Radio, title: 'Connected', desc: 'Live updates via mesh relay network', color: 'text-safety-600 bg-safety-50 border-safety-200' },
          { icon: CheckCircle2, title: 'Supported', desc: 'AI triage and rescue teams coordinated', color: 'text-violet-600 bg-violet-50 border-violet-200' },
        ].map(({ icon: Icon, title, desc, color }) => (
          <GlassCard key={title} padding="p-4" hover className={`border ${color.split(' ').slice(1).join(' ')}`}>
            <Icon className={`w-6 h-6 mb-2 ${color.split(' ')[0]}`} />
            <p className="font-bold text-slate-900 text-sm">{title}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
          </GlassCard>
        ))}
      </div>

      {report.advice && (
        <Alert variant="warning" title="Safety Guidance from AI Triage" animate>
          {report.advice}
        </Alert>
      )}

      {report.response && <ResponsePanel response={report.response} />}

      <GlassCard>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900 text-sm">Emergency Message on File</p>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{report.message}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
