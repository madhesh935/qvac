import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import GlassCard, { SectionHeader } from './GlassCard';
import { RESCUE_STAGES, deriveRescueStage } from '../../hooks/useVictimProfile';
import { Route } from 'lucide-react';

export default function RescueJourney({ report }) {
  const current = deriveRescueStage(report);

  return (
    <GlassCard glow>
      <SectionHeader
        icon={Route}
        title="Rescue Journey"
        subtitle="Track every step of your rescue — you always know what happens next"
      />

      <div className="relative">
        {RESCUE_STAGES.map((stage, index) => {
          const done = current >= stage.id;
          const active = current === stage.id || (current === stage.id - 1 && !done);
          const isLast = index === RESCUE_STAGES.length - 1;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {!isLast && (
                <div
                  className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${
                    done ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}

              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  done
                    ? 'bg-emerald-500 text-white shadow-md'
                    : active
                      ? 'bg-emergency text-white ring-4 ring-emergency/20'
                      : 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                ) : active ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>

              <div className="flex-1 pt-0.5">
                <p className={`font-semibold text-sm ${active ? 'text-emergency' : done ? 'text-slate-800' : 'text-slate-400'}`}>
                  {stage.label}
                </p>
                {active && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-emergency/80 mt-1 font-medium"
                  >
                    In progress now…
                  </motion.p>
                )}
                {done && !active && (
                  <p className="text-xs text-emerald-600 mt-0.5 font-medium">Complete</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Progress</span>
          <span className="font-bold text-slate-700">{Math.round((current / 8) * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emergency to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(current / 8) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </GlassCard>
  );
}
