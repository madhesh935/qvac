import { motion } from 'framer-motion';
import { MapPin, Radio, Shield, AlertTriangle, ChevronRight } from 'lucide-react';
import PortalCard from '../../components/portal/PortalCard';

export default function PortalHome({ location, locationError, hasReport, online, onSOS, onStatus }) {
  const gpsOk = !!location;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-portal-border overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        }}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-red-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-red-400/90">
              National Emergency Network
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
            Emergency Assistance Portal
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl mb-6">
            Request rescue during floods, earthquakes, fires, and disasters. Your SOS reaches command
            center through the offline mesh relay — even without cellular data.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <div
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold ${
                gpsOk
                  ? 'border-emerald-800/50 bg-emerald-950/40 text-emerald-400'
                  : 'border-amber-800/50 bg-amber-950/40 text-amber-400'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {gpsOk
                ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                : locationError || 'Acquiring GPS…'}
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-portal-border bg-portal-card px-3 py-2 text-xs font-semibold text-portal-muted">
              <Radio className={`w-3.5 h-3.5 ${online ? 'text-emerald-400' : 'text-amber-400'}`} />
              {online ? 'Relay · Online' : 'Relay · Offline queue'}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onSOS}
              className="flex-1 py-4 px-6 rounded-xl font-bold text-white text-sm touch-target transition-transform active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #EF4444, #B91C1B)',
                boxShadow: '0 8px 32px rgba(239,68,68,0.4)',
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Report Emergency (SOS)
              </span>
            </button>
            {hasReport && (
              <button
                type="button"
                onClick={onStatus}
                className="flex-1 py-4 px-6 rounded-xl border border-safety/40 bg-safety/10 text-safety font-bold text-sm hover:bg-safety/20 transition-colors touch-target"
              >
                Open Rescue Dashboard
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { title: 'Stay Calm', desc: 'Help is coming. Your report is in the system.' },
          { title: 'Stay Put', desc: 'Remain at your location unless unsafe.' },
          { title: 'Stay Connected', desc: 'Dashboard updates automatically in real time.' },
        ].map(({ title, desc }) => (
          <PortalCard key={title} padding="p-4">
            <p className="font-semibold text-portal-text text-sm mb-1">{title}</p>
            <p className="text-xs text-portal-muted leading-relaxed">{desc}</p>
          </PortalCard>
        ))}
      </div>

      {hasReport && (
        <PortalCard hover padding="p-4">
          <button
            type="button"
            onClick={onStatus}
            className="flex w-full items-center justify-between gap-3 text-left touch-target"
          >
            <div>
              <p className="text-sm font-semibold text-portal-text">Active rescue request</p>
              <p className="text-xs text-portal-muted mt-0.5">View status, map, and live updates</p>
            </div>
            <ChevronRight className="w-5 h-5 text-portal-muted" />
          </button>
        </PortalCard>
      )}
    </div>
  );
}
