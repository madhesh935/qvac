import { deriveRescueStage, RESCUE_STAGES } from '../../hooks/useVictimProfile';
import PortalCard, { PortalSectionTitle } from './PortalCard';
import { Check } from 'lucide-react';

function formatTs(report, offsetMin) {
  if (!report?.created_at) return '';
  const d = new Date(report.created_at);
  d.setMinutes(d.getMinutes() + offsetMin);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function RescueJourneyBar({ report }) {
  const current = deriveRescueStage(report);
  const timestamps = [0, 1, 3, 5, 8, 10, 12, 15];

  return (
    <PortalCard padding="p-5">
      <PortalSectionTitle>Rescue Journey</PortalSectionTitle>
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex min-w-[720px] items-start gap-0">
          {RESCUE_STAGES.map((stage, i) => {
            const done = current >= stage.id;
            const active = current === stage.id;
            const isLast = i === RESCUE_STAGES.length - 1;
            return (
              <div key={stage.id} className="flex flex-1 flex-col items-center relative">
                {!isLast && (
                  <div
                    className="absolute top-4 left-[50%] w-full h-0.5 -z-0"
                    style={{ background: done && current > stage.id ? '#3B82F6' : '#374151' }}
                  />
                )}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    done
                      ? 'bg-safety border-safety text-white'
                      : active
                        ? 'bg-emergency border-emergency text-white ring-4 ring-emergency/20'
                        : 'bg-portal-bg border-portal-border text-portal-muted'
                  }`}
                >
                  {done ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
                </div>
                <p
                  className={`mt-2 text-[10px] sm:text-xs font-medium text-center px-1 leading-tight max-w-[88px] ${
                    active ? 'text-emergency' : done ? 'text-portal-text' : 'text-portal-muted'
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-[9px] text-portal-muted mt-0.5 tabular-nums">
                  {done || active ? formatTs(report, timestamps[i]) : '—'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </PortalCard>
  );
}
