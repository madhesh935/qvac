import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { io } from 'socket.io-client';
import axios from 'axios';
import { WifiOff } from 'lucide-react';

import VictimSidebar from './layout/VictimSidebar';
import PortalTopBar from './layout/PortalTopBar';
import MobileBottomNav from './layout/MobileBottomNav';
import PortalHome from './pages/portal/PortalHome';
import RescueStatusPage from './pages/portal/RescueStatusPage';
import SettingsPage from './pages/portal/SettingsPage';
import EmergencyReportPage from './pages/EmergencyReportPage';

import LiveUpdates from './components/dashboard/LiveUpdates';
import LocationMap from './components/dashboard/LocationMap';
import MedicalInfo from './components/dashboard/MedicalInfo';
import FamilyComm from './components/dashboard/FamilyComm';
import SafetyCenter from './components/dashboard/SafetyCenter';
import ResourceCenters from './components/dashboard/ResourceCenters';
import CommunitySupport from './components/dashboard/CommunitySupport';
import EmergencyContactsPanel from './components/dashboard/EmergencyContactsPanel';
import OfflineCenter from './components/dashboard/OfflineCenter';
import { useVictimProfile, useNetworkStatus } from './hooks/useVictimProfile';
import { useActiveReport, getInitialPhase, persistPhase } from './hooks/useActiveReport';

const RELAY_URL = import.meta.env.VITE_RELAY_URL || 'http://localhost:5000';
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_BACKEND_WS ||
  'http://localhost:3001';

function OfflineBanner({ online }) {
  if (online) return null;
  return (
    <div className="flex items-center justify-center gap-2 border-b border-amber-900/50 bg-amber-950/80 px-4 py-1.5">
      <WifiOff className="h-3.5 w-3.5 text-amber-400" />
      <p className="text-xs font-semibold text-amber-200/90">
        Offline · Reports queue via mesh relay
      </p>
    </div>
  );
}

function MobileDrawer({ open, onClose, phase, setPhase, onSOS }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 lg:hidden" onClick={onClose} aria-hidden />
      <div className="fixed left-0 top-0 z-[60] h-full w-[280px] lg:hidden">
        <VictimSidebar
          phase={phase}
          setPhase={(p) => { setPhase(p); onClose(); }}
          collapsed={false}
          onToggle={onClose}
          onSOS={() => { onSOS(); onClose(); }}
        />
      </div>
    </>
  );
}

export default function VictimApp() {
  const [phase, setPhase] = useState(getInitialPhase);
  const { report, setReport, hydrating, backendConnected } = useActiveReport(BACKEND_URL);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);
  const online = useNetworkStatus();
  const { profile, saveProfile, familyNotifications, addFamilyNotification } = useVictimProfile();

  useEffect(() => {
    persistPhase(phase);
  }, [phase]);

  const refreshLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocationError(null);
      },
      () => setLocationError('GPS unavailable')
    );
  }, []);

  useEffect(() => {
    refreshLocation();
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: Infinity,
    });
    socketRef.current = socket;

    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [refreshLocation]);

  useEffect(() => {
    if (!report || !socketRef.current) return;
    const id = report._id;
    const onPriority = ({ report_id, priority, advice }) => {
      if (report_id === id) setReport((p) => ({ ...p, priority, advice }));
    };
    const onResponse = ({ report_id, response }) => {
      if (report_id === id) setReport((p) => ({ ...p, response, status: 'ASSIGNED' }));
    };
    const onStatus = ({ report_id, status }) => {
      if (report_id === id) setReport((p) => ({ ...p, status }));
    };
    socketRef.current.on('priority-updated', onPriority);
    socketRef.current.on('rescue-response', onResponse);
    socketRef.current.on('status-updated', onStatus);
    return () => {
      socketRef.current.off('priority-updated', onPriority);
      socketRef.current.off('rescue-response', onResponse);
      socketRef.current.off('status-updated', onStatus);
    };
  }, [report]);

  const handleSubmit = async ({ victim_name, message }) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { data } = await axios.post(`${RELAY_URL}/relay`, {
        victim_name,
        message,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
      });
      setReport(data.report);
      setPhase('status');
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Failed to send SOS. Check your network.');
    } finally {
      setSubmitting(false);
    }
  };

  const navigate = (id) => setPhase(id);

  const sectionWrap = (content) => (
    <div className="portal-page portal-form pb-24 lg:pb-8">{content}</div>
  );

  const renderPhase = () => {
    switch (phase) {
      case 'home':
        return (
          <PortalHome
            location={location}
            locationError={locationError}
            hasReport={!!report}
            online={online}
            onSOS={() => setPhase('report')}
            onStatus={() => setPhase('status')}
          />
        );
      case 'report':
        return sectionWrap(
          <EmergencyReportPage
            onSubmit={handleSubmit}
            location={location}
            locationError={locationError}
            submitting={submitting}
            error={submitError}
            onBack={() => setPhase('home')}
          />
        );
      case 'status':
        return (
          <RescueStatusPage
            report={report}
            location={location}
            online={online}
            onNavigate={navigate}
          />
        );
      case 'updates':
        return sectionWrap(
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {report ? <LiveUpdates report={report} /> : (
              <p className="text-portal-muted text-center py-16">No active request</p>
            )}
          </div>
        );
      case 'location':
        return sectionWrap(
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <LocationMap
              report={report}
              location={location}
              locationError={locationError}
              onRefreshLocation={refreshLocation}
            />
          </div>
        );
      case 'medical':
        return sectionWrap(
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <MedicalInfo profile={profile} saveProfile={saveProfile} report={report} />
          </div>
        );
      case 'family':
        return sectionWrap(
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <FamilyComm
              profile={profile}
              saveProfile={saveProfile}
              familyNotifications={familyNotifications}
              addFamilyNotification={addFamilyNotification}
              report={report}
            />
          </div>
        );
      case 'safety':
        return sectionWrap(
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <SafetyCenter />
          </div>
        );
      case 'resources':
        return sectionWrap(
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <ResourceCenters location={location} />
          </div>
        );
      case 'community':
        return sectionWrap(
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <CommunitySupport location={location} />
          </div>
        );
      case 'contacts':
        return sectionWrap(
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <EmergencyContactsPanel />
          </div>
        );
      case 'offline':
        return sectionWrap(
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <OfflineCenter online={online} report={report} />
          </div>
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-dvh bg-portal-bg text-portal-text">
      <div className="hidden lg:block">
        <VictimSidebar
          phase={phase}
          setPhase={setPhase}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
          onSOS={() => setPhase('report')}
        />
      </div>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        phase={phase}
        setPhase={setPhase}
        onSOS={() => setPhase('report')}
      />

      <div
        className={`flex min-h-dvh flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        }`}
      >
        <PortalTopBar
          phase={phase}
          online={online}
          backendConnected={backendConnected}
          socketConnected={socketConnected}
          sidebarCollapsed={sidebarCollapsed}
          onMenuOpen={() => setMobileOpen(true)}
          report={report}
          onStatusClick={() => setPhase('updates')}
        />

        <div className="pt-14">
          <OfflineBanner online={online} />
          {backendConnected === false && (
            <div className="flex items-center justify-center gap-2 border-b border-red-900/50 bg-red-950/60 px-4 py-1.5">
              <p className="text-xs font-semibold text-red-300">
                Backend unreachable at {BACKEND_URL} — SOS still queues via relay
              </p>
            </div>
          )}
        </div>

        <main className="flex-1">
          {hydrating ? (
            <div className="flex items-center justify-center py-24 text-portal-muted text-sm">
              Restoring your session…
            </div>
          ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {renderPhase()}
            </motion.div>
          </AnimatePresence>
          )}
        </main>
      </div>

      <MobileBottomNav phase={phase} setPhase={setPhase} />
    </div>
  );
}
