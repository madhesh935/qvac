import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, ChevronDown } from 'lucide-react';
import GlassCard, { SectionHeader } from './GlassCard';
import { SAFETY_CATEGORIES, SAFETY_GUIDES } from '../../data/emergencyData';

export default function SafetyCenter() {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return SAFETY_CATEGORIES;
    const q = query.toLowerCase();
    return SAFETY_CATEGORIES.filter(
      (c) => c.label.toLowerCase().includes(q) || SAFETY_GUIDES[c.id]?.tips.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="space-y-4">
      <GlassCard>
        <SectionHeader
          icon={BookOpen}
          title="Safety Knowledge Center"
          subtitle="Stay calm — follow these guides while you wait for rescue"
        />
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-portal-muted" />
          <input
            type="search"
            placeholder="Search safety guides…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-[#0a1628] border-2 border-portal-border rounded-2xl text-sm text-portal-text placeholder:text-portal-muted focus:border-safety focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          {filtered.map(({ id, label, icon: Icon, color }) => {
            const guide = SAFETY_GUIDES[id];
            const isOpen = expanded === id;
            return (
              <div key={id} className="rounded-2xl border border-portal-border overflow-hidden bg-[#0a1628]">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.03] transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-portal-text flex-1">{label}</span>
                  <ChevronDown className={`w-5 h-5 text-portal-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && guide && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="px-4 pb-4 space-y-2 border-t border-portal-border pt-3">
                        {guide.tips.map((tip, i) => (
                          <li key={i} className="flex gap-2 text-sm text-portal-muted leading-relaxed">
                            <span className="w-5 h-5 rounded-full bg-safety/20 text-safety text-xs font-bold flex items-center justify-center shrink-0">
                              {i + 1}
                            </span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
