import { motion } from 'framer-motion';

export default function Timeline({ items }) {
  return (
    <ol className="relative space-y-0" aria-label="Activity timeline">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isActive = item.active;
        const isComplete = item.complete;

        return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07, duration: 0.3 }}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            {!isLast && (
              <div
                className={`absolute left-[15px] top-10 bottom-0 w-0.5 ${
                  isComplete ? 'bg-emerald-500/60' : 'bg-portal-border'
                }`}
                aria-hidden
              />
            )}

            <div className="shrink-0 relative z-10 mt-0.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-emergency border-emergency text-white ring-4 ring-emergency/20'
                    : isComplete
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'bg-portal-card border-portal-border text-portal-muted'
                }`}
              >
                {item.icon ? (
                  <item.icon
                    className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse-fast' : ''}`}
                    strokeWidth={2.5}
                    aria-hidden
                  />
                ) : isComplete ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-portal-muted/50" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p
                    className={`font-semibold text-sm leading-tight ${
                      isActive
                        ? 'text-emergency'
                        : isComplete
                          ? 'text-portal-text'
                          : 'text-portal-muted'
                    }`}
                  >
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-xs text-portal-muted mt-1 leading-relaxed max-w-xs">
                      {item.description}
                    </p>
                  )}
                  {item.unread && (
                    <span className="inline-flex mt-2 items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/50">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      New Update
                    </span>
                  )}
                </div>
                {item.time && (
                  <time className="text-[10px] text-portal-muted font-medium whitespace-nowrap shrink-0 mt-0.5 bg-portal-bg px-2 py-0.5 rounded-full border border-portal-border">
                    {item.time}
                  </time>
                )}
              </div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
