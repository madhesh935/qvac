import StatusHero from '../../components/portal/StatusHero';
import QuickActionsGrid from '../../components/portal/QuickActionsGrid';
import RescueJourneyBar from '../../components/portal/RescueJourneyBar';
import LiveUpdatesCompact from '../../components/portal/LiveUpdatesCompact';
import LocationCompact from '../../components/portal/LocationCompact';
import ResourcesCompact from '../../components/portal/ResourcesCompact';
import ContactsCompact from '../../components/portal/ContactsCompact';
import FeatureTiles from '../../components/portal/FeatureTiles';
import PortalCard from '../../components/portal/PortalCard';

export default function RescueStatusPage({
  report,
  location,
  online,
  onNavigate,
}) {
  if (!report) {
    return (
      <div className="p-6 lg:p-8 max-w-lg mx-auto">
        <PortalCard className="text-center py-12">
          <p className="text-portal-text font-semibold mb-2">No active rescue request</p>
          <p className="text-sm text-portal-muted mb-6">
            Submit an emergency report to track rescue status in real time.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('report')}
            className="w-full py-3.5 rounded-xl bg-emergency hover:bg-emergency-dark text-white font-bold text-sm transition-colors"
          >
            Report Emergency (SOS)
          </button>
        </PortalCard>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-[1600px] mx-auto">
      {/* Row 1: Hero + Quick actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 min-h-[220px]">
          <StatusHero report={report} />
        </div>
        <div className="xl:col-span-1">
          <QuickActionsGrid onNavigate={onNavigate} />
        </div>
      </div>

      {/* Row 2: Journey */}
      <RescueJourneyBar report={report} />

      {/* Row 3: Updates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <LiveUpdatesCompact report={report} />
        <LocationCompact location={location} onNavigate={onNavigate} />
        <ResourcesCompact location={location} onNavigate={onNavigate} />
        <ContactsCompact onNavigate={onNavigate} />
      </div>

      {/* Row 4: Feature tiles */}
      <FeatureTiles online={online} onNavigate={onNavigate} onSync={() => onNavigate('offline')} />
    </div>
  );
}
