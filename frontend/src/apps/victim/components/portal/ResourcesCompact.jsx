import PortalCard, { PortalSectionTitle } from './PortalCard';
import { mockResources } from '../../data/emergencyData';

export default function ResourcesCompact({ location, onNavigate }) {
  const resources = mockResources(location?.latitude, location?.longitude).slice(0, 4);

  return (
    <PortalCard className="h-full" padding="p-5">
      <PortalSectionTitle
        action={
          <button type="button" onClick={() => onNavigate('resources')} className="text-xs font-semibold text-safety">
            View all
          </button>
        }
      >
        Nearby Resources
      </PortalSectionTitle>
      <ul className="space-y-2.5">
        {resources.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-portal-text truncate">{r.name.replace('Central ', '').replace('District ', '')}</span>
            <span className="text-portal-muted text-xs font-mono shrink-0 tabular-nums">{r.dist}</span>
          </li>
        ))}
      </ul>
    </PortalCard>
  );
}
