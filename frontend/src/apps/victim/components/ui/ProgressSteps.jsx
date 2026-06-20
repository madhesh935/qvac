import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function ProgressSteps({ steps, currentStep }) {
  const progressPct = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <nav aria-label="Progress" className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-portal-text">
          Step {currentStep} of {steps.length}
        </span>
        <span className="text-sm font-medium text-portal-muted">
          {steps[currentStep - 1]?.label}
        </span>
      </div>

      <div className="relative h-1.5 bg-portal-border rounded-full overflow-hidden mb-4">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-emergency-600 to-emergency-500"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <ol className="flex items-center justify-between gap-1">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <li
              key={step.id}
              className="flex flex-col items-center gap-1.5"
              aria-current={isCurrent ? 'step' : undefined}
            >
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 transition-colors duration-300 ${
                  isComplete
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isCurrent
                      ? 'bg-emergency border-emergency text-white ring-4 ring-emergency/20'
                      : 'bg-portal-card border-portal-border text-portal-muted'
                }`}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  stepNum
                )}
              </motion.div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider text-center ${
                  isCurrent
                    ? 'text-emergency'
                    : isComplete
                      ? 'text-emerald-400'
                      : 'text-portal-muted'
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
