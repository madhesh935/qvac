import { motion } from 'framer-motion';
import { Radio, Truck, CheckCircle2, Shield, Volume2 } from 'lucide-react';

export default function ResponsePanel({ response }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Rescue team message card */}
      <div className="rounded-2xl overflow-hidden border-2 border-emerald-300 shadow-success">
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)' }}
        >
          <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 border border-white/30">
            <Radio className="w-5 h-5 text-white" strokeWidth={2} aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-white leading-tight">
              Rescue Team Response
            </h3>
            <p className="text-emerald-100 text-[11px] font-medium mt-0.5">
              Official message from command center
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-2.5 py-1 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
            <span className="text-[10px] font-bold text-white/90">LIVE</span>
          </div>
        </div>

        {/* Message body */}
        <div className="bg-white p-5">
          <p className="text-slate-800 text-base leading-relaxed font-medium">{response}</p>

          {/* Status strip */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2.5 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-200">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden />
              <span className="text-sm font-semibold text-emerald-800">Help is on the way</span>
              <CheckCircle2 className="w-4 h-4 ml-auto text-emerald-500 shrink-0" aria-hidden />
            </div>
            <div className="flex items-center gap-2.5 bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
              <Shield className="w-4 h-4 text-blue-600 shrink-0" aria-hidden />
              <span className="text-xs text-blue-700 font-medium">
                Stay at your current location. Do not move unless directed.
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
