import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default Leaflet marker icons broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const PRIORITY_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#22c55e',
};

function createMarkerIcon(priority, isSelected) {
  const color = PRIORITY_COLORS[priority] || '#6b7280';
  const size = isSelected ? 22 : 16;
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      border:${isSelected ? '3px' : '2px'} solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.6)${isSelected ? ',0 0 12px ' + color : ''};
      transition:all 0.2s;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Auto-fit map to show all incident markers
function FitBounds({ incidents }) {
  const map = useMap();
  useEffect(() => {
    const points = incidents
      .filter((i) => i.latitude && i.longitude)
      .map((i) => [i.latitude, i.longitude]);
    if (points.length > 0) {
      map.fitBounds(points, { padding: [60, 60], maxZoom: 14, animate: true });
    }
  }, [incidents.length, map]);
  return null;
}

export default function MapView({ incidents, selectedIncident, onSelectIncident }) {
  const withLocation = incidents.filter((i) => i.latitude && i.longitude);

  const defaultCenter =
    withLocation.length > 0
      ? [withLocation[0].latitude, withLocation[0].longitude]
      : [20.5937, 78.9629]; // Default: India center

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {withLocation.map((incident) => (
          <Marker
            key={incident._id}
            position={[incident.latitude, incident.longitude]}
            icon={createMarkerIcon(
              incident.priority,
              selectedIncident?._id === incident._id
            )}
            eventHandlers={{ click: () => onSelectIncident(incident) }}
          >
            <Popup>
              <div style={{ minWidth: 160 }}>
                <strong style={{ display: 'block', marginBottom: 4 }}>
                  {incident.victim_name}
                </strong>
                <span
                  style={{
                    color: PRIORITY_COLORS[incident.priority],
                    fontWeight: 'bold',
                    fontSize: 11,
                  }}
                >
                  ● {incident.priority}
                </span>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#555' }}>
                  {incident.message.slice(0, 80)}
                  {incident.message.length > 80 ? '…' : ''}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {withLocation.length > 1 && <FitBounds incidents={withLocation} />}
      </MapContainer>

      {/* Overlay when no GPS data */}
      {withLocation.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-gray-900/90 backdrop-blur rounded-2xl p-5 text-center border border-gray-700">
            <div className="text-3xl mb-2">🗺️</div>
            <p className="text-gray-300 text-sm font-medium">Map View</p>
            <p className="text-gray-600 text-xs mt-1">
              Incidents with GPS will appear here
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-gray-900/90 backdrop-blur rounded-xl p-3 border border-gray-700">
        <p className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider">
          Priority
        </p>
        {Object.entries(PRIORITY_COLORS).map(([p, color]) => (
          <div key={p} className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: color }}
            />
            <span className="text-gray-400 text-xs">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
