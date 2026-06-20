import { Clock, Truck } from 'lucide-react';
import { estimateEta } from '../../hooks/useVictimProfile';
import { PriorityBadge } from '../ui/Badge';

export default function StatusHero({ report }) {
  const eta = estimateEta(report);
  const teamLine =
    report?.status === 'ASSIGNED' || report?.response
      ? 'Rescue Team Alpha is on the way!'
      : report?.status === 'PENDING'
        ? 'Your request is under review'
        : 'Help is on the way';

  const subLine =
    report?.response ||
    (report?.status === 'ASSIGNED'
      ? 'Stay calm. Help is on the way.'
      : 'Command center is coordinating the nearest rescue unit.');

  const enRoute =
    report?.status === 'ASSIGNED' ? 'En Route · 2.4 km away' : 'Awaiting team dispatch';

  return (
    <div
      className="rounded-xl overflow-hidden border border-emergency/40 h-full min-h-[220px] flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 35%, #B91C1C 70%, #DC2626 100%)',
        boxShadow: '0 8px 40px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      <div className="p-5 sm:p-6 flex-1 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <PriorityBadge priority={report?.priority || 'HIGH'} size="md" />
            <span className="inline-flex items-center gap-1.5 rounded-md bg-black/25 border border-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              <Clock className="w-3 h-3" />
              ETA {eta}
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug mb-2">
            {teamLine}
          </h2>
          <p className="text-red-100/90 text-sm leading-relaxed max-w-md">{subLine}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
            <Truck className="w-4 h-4" />
            {enRoute}
          </p>
        </div>
        <div className="hidden sm:flex w-36 shrink-0 items-end justify-center opacity-90">
          <div className="w-full aspect-square max-w-[120px] rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Truck className="w-14 h-14 text-white/80" strokeWidth={1.25} />
          </div>
        </div>
      </div>
    </div>
  );
}
