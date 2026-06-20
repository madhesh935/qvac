import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MapPin, Wifi, WifiOff, ChevronLeft, Activity, AlertCircle } from 'lucide-react';

function NetworkIndicator() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {online ? (
        <motion.div
          key="online"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-1.5 bg-white/15 backdrop-blur rounded-full px-2.5 py-1"
          role="status"
          aria-label="Network online"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-white/90 hidden sm:block">ONLINE</span>
          <Wifi className="w-3 h-3 text-emerald-300 sm:hidden" aria-hidden />
        </motion.div>
      ) : (
        <motion.div
          key="offline"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex items-center gap-1.5 bg-amber-500/20 backdrop-blur rounded-full px-2.5 py-1 border border-amber-400/30"
          role="status"
          aria-label="Network offline — mesh relay active"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] font-bold text-amber-200 hidden sm:block">OFFLINE</span>
          <WifiOff className="w-3 h-3 text-amber-300 sm:hidden" aria-hidden />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GPSBadge({ location, locationError }) {
  const gpsOk = !!location;
  const gpsFailed = !!locationError;

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
        gpsOk
          ? 'bg-emerald-500/20 border border-emerald-400/30'
          : gpsFailed
            ? 'bg-amber-500/20 border border-amber-400/30'
            : 'bg-white/10'
      }`}
      role="status"
      aria-label={
        gpsOk
          ? 'GPS location active'
          : gpsFailed
            ? 'GPS unavailable'
            : 'Acquiring GPS location'
      }
    >
      <MapPin
        className={`w-3 h-3 ${
          gpsOk
            ? 'text-emerald-300'
            : gpsFailed
              ? 'text-amber-300'
              : 'text-white/60 animate-pulse-soft'
        }`}
        aria-hidden
      />
      <span className="text-[10px] font-bold text-white/90 hidden xs:block">
        {gpsOk ? 'GPS' : gpsFailed ? 'NO GPS' : 'GPS...'}
      </span>
    </div>
  );
}

export default function Header({ location, locationError, showBack, onBack, title, subtitle }) {
  return (
    <header className="sticky top-0 z-50 safe-top" style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)' }}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '20px 20px',
      }} aria-hidden />
      
      <div className="relative max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Back button */}
          {showBack && (
            <motion.button
              onClick={onBack}
              whileTap={{ scale: 0.92 }}
              className="touch-target flex items-center justify-center w-9 h-9 -ml-1 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} aria-hidden />
            </motion.button>
          )}

          {/* Logo + Title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0 border border-white/20">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.25} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display font-bold text-base leading-tight text-white truncate">
                {title || 'ResQMesh'}
              </h1>
              <p className="text-red-200 text-[11px] truncate font-medium">
                {subtitle || 'Emergency Assistance Portal'}
              </p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-1.5">
            <GPSBadge location={location} locationError={locationError} />
            <NetworkIndicator />
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </header>
  );
}
