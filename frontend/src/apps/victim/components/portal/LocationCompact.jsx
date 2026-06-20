import { Navigation } from 'lucide-react';
import PortalCard, { PortalSectionTitle } from './PortalCard';

export default function LocationCompact({ location, onNavigate }) {
  const lat = location?.latitude;
  const lng = location?.longitude;

  return (
    <PortalCard className="h-full flex flex-col" padding="p-5">
      <PortalSectionTitle
        action={
          <button
            type="button"
            onClick={() => onNavigate('location')}
            className="text-xs font-semibold text-safety hover:text-safety-400"
          >
            View Full Map
          </button>
        }
      >
        Location Overview
      </PortalSectionTitle>
      {lat && lng ? (
        <>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-portal-muted font-semibold">Latitude</dt>
              <dd className="font-mono text-portal-text tabular-nums">{lat.toFixed(4)}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-wider text-portal-muted font-semibold">Longitude</dt>
              <dd className="font-mono text-portal-text tabular-nums">{lng.toFixed(4)}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[10px] uppercase tracking-wider text-portal-muted font-semibold">Accuracy</dt>
              <dd className="text-portal-text">± 15 m</dd>
            </div>
          </dl>
          <div className="rounded-lg overflow-hidden border border-portal-border h-28 bg-portal-bg relative flex-1 min-h-[112px]">
            <iframe
              title="Map preview"
              className="absolute inset-0 w-full h-full border-0 opacity-90"
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.006}%2C${lat - 0.004}%2C${lng + 0.006}%2C${lat + 0.004}&layer=mapnik&marker=${lat}%2C${lng}`}
            />
            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-safety flex items-center justify-center shadow-lg">
              <Navigation className="w-4 h-4 text-white" />
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-portal-muted py-6 text-center">GPS not available</p>
      )}
    </PortalCard>
  );
}
