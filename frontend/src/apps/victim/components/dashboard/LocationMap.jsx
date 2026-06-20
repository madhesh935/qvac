import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import Leaflet from 'leaflet';
import { motion } from 'framer-motion';
import {
  MapPin, RefreshCw, Share2, Navigation, Signal, Crosshair,
} from 'lucide-react';
import GlassCard, { SectionHeader } from './GlassCard';
import Button from '../ui/Button';
import { mockResources } from '../../data/emergencyData';

delete Leaflet.Icon.Default.prototype._getIconUrl;
Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function victimIcon() {
  return Leaflet.divIcon({
    className: '',
    html: `<div style="background:#DC2626;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function shelterIcon() {
  return Leaflet.divIcon({
    className: '',
    html: `<div style="background:#2563EB;width:12px;height:12px;border-radius:50%;border:2px solid white"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function MapCenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 14, { animate: true });
  }, [lat, lng, map]);
  return null;
}

export default function LocationMap({ report, location, onRefreshLocation, locationError }) {
  const lat = location?.latitude || report?.latitude;
  const lng = location?.longitude || report?.longitude;
  const resources = useMemo(() => mockResources(lat, lng), [lat, lng]);
  const hasLocation = !!(lat && lng);

  return (
    <div className="space-y-4">
      <GlassCard>
        <SectionHeader
          icon={MapPin}
          title="Location & Map"
          subtitle="Your position shared with rescue teams"
        />

        {hasLocation ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Latitude', value: lat.toFixed(6) },
                { label: 'Longitude', value: lng.toFixed(6) },
                { label: 'Accuracy', value: '±15 m (GPS)' },
                { label: 'Last Update', value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#0a1628] rounded-xl px-3 py-2.5 border border-portal-border">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-portal-muted">{label}</p>
                  <p className="font-mono text-sm font-semibold text-portal-text mt-0.5 truncate">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-800/50">
                <Signal className="w-3.5 h-3.5" /> GPS Active
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-portal-muted bg-portal-bg px-2.5 py-1 rounded-full border border-portal-border">
                <Crosshair className="w-3.5 h-3.5" /> High precision
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-portal-border h-56 sm:h-72 mb-4">
              <MapContainer center={[lat, lng]} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                <MapCenter lat={lat} lng={lng} />
                <Marker position={[lat, lng]} icon={victimIcon()}>
                  <Popup><strong>Your Location</strong><br />Rescue teams see this pin</Popup>
                </Marker>
                <Circle center={[lat, lng]} radius={200} pathOptions={{ color: '#DC2626', fillColor: '#DC2626', fillOpacity: 0.08 }} />
                {resources.slice(0, 4).map((r) => (
                  <Marker key={r.id} position={[r.lat, r.lng]} icon={shelterIcon()}>
                    <Popup><strong>{r.name}</strong><br />{r.type} · {r.dist}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRefreshLocation}>
                Refresh Location
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Share2}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'My Location', text: `${lat}, ${lng}`, url: `https://maps.google.com/?q=${lat},${lng}` });
                  }
                }}
              >
                Share Location
              </Button>
              <a
                href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 h-10 px-4 text-sm font-semibold rounded-xl border-2 border-portal-border text-portal-text hover:bg-white/[0.04]"
              >
                <Navigation className="w-4 h-4" /> Full Map
              </a>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <MapPin className="w-12 h-12 text-portal-muted mx-auto mb-3" />
            <p className="font-semibold text-portal-text">{locationError || 'Location not available'}</p>
            <Button variant="secondary" size="md" className="mt-4" icon={RefreshCw} onClick={onRefreshLocation}>
              Try Again
            </Button>
          </div>
        )}
      </GlassCard>

      {hasLocation && (
        <GlassCard padding="p-4">
          <h3 className="font-bold text-sm text-portal-text mb-3">Nearby Safe Points</h3>
          <div className="space-y-2">
            {resources.filter((r) => ['Shelter', 'Hospital'].includes(r.type)).map((r) => (
              <motion.div
                key={r.id}
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0a1628] border border-portal-border"
              >
                <span className="text-xl">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-portal-text truncate">{r.name}</p>
                  <p className="text-xs text-portal-muted">{r.dist} · {r.avail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
