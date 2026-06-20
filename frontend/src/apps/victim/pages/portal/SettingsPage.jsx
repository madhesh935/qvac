import PortalCard from '../../components/portal/PortalCard';

export default function SettingsPage() {
  return (
    <div className="portal-page p-6 lg:p-8 max-w-2xl mx-auto">
      <PortalCard>
        <h2 className="font-display text-lg font-bold text-portal-text mb-2">Settings</h2>
        <p className="text-sm text-portal-muted leading-relaxed">
          Portal preferences and notification settings. Medical and family contact data is stored locally on
          this device for offline access during emergencies.
        </p>
        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between border-b border-portal-border pb-3">
            <dt className="text-portal-muted">App version</dt>
            <dd className="font-mono text-portal-text">ResQMesh 1.0</dd>
          </div>
          <div className="flex justify-between border-b border-portal-border pb-3">
            <dt className="text-portal-muted">Mesh relay</dt>
            <dd className="text-success font-semibold">Enabled</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-portal-muted">Data storage</dt>
            <dd className="text-portal-text">Local device only</dd>
          </div>
        </dl>
      </PortalCard>
    </div>
  );
}
