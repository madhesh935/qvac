import { Wifi, WifiOff, CloudOff, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard, { SectionHeader } from './GlassCard';
import Alert from '../ui/Alert';

export default function OfflineCenter({ online, report }) {
  const pending = !online && report ? 1 : 0;
  const delivered = report ? 1 : 0;

  return (
    <div className="space-y-4">
      <GlassCard glow>
        <SectionHeader
          icon={online ? Wifi : WifiOff}
          title="Offline Status Center"
          subtitle="Mesh relay keeps you connected even without internet"
        />

        <div className={`flex items-center gap-4 p-5 rounded-2xl mb-4 ${
          online ? 'bg-emerald-950/40 border border-emerald-800/50' : 'bg-amber-950/40 border border-amber-800/50'
        }`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            online ? 'bg-emerald-900/50' : 'bg-amber-900/50'
          }`}>
            {online ? (
              <Wifi className="w-7 h-7 text-emerald-400" />
            ) : (
              <CloudOff className="w-7 h-7 text-amber-400" />
            )}
          </div>
          <div>
            <p className={`font-display font-bold text-lg ${online ? 'text-emerald-300' : 'text-amber-300'}`}>
              {online ? 'Online' : 'Offline Mode'}
            </p>
            <p className={`text-sm ${online ? 'text-emerald-400/80' : 'text-amber-400/80'}`}>
              {online
                ? 'All reports sync in real time'
                : 'Reports queued via Raspberry Pi mesh relay'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Network', value: online ? 'Online' : 'Offline', icon: online ? Wifi : WifiOff, ok: online },
            { label: 'Pending', value: pending, icon: Clock, ok: pending === 0 },
            { label: 'Delivered', value: delivered, icon: CheckCircle2, ok: delivered > 0 },
            { label: 'Last Sync', value: report ? 'Just now' : '—', icon: Loader2, ok: true },
          ].map(({ label, value, icon: Icon, ok }) => (
            <div key={label} className="text-center p-3 rounded-xl bg-[#0a1628] border border-portal-border">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${ok ? 'text-emerald-400' : 'text-amber-400'}`} />
              <p className="text-lg font-black text-portal-text">{value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-portal-muted">{label}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {!online && (
        <Alert variant="offline" title="Mesh Relay Active">
          Your device is offline but the ResQMesh relay node will store and forward your report when connectivity returns.
        </Alert>
      )}
    </div>
  );
}
