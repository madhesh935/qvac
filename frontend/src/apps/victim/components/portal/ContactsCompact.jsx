import { Phone } from 'lucide-react';
import PortalCard, { PortalSectionTitle } from './PortalCard';
import { EMERGENCY_HOTLINES } from '../../data/emergencyData';

export default function ContactsCompact({ onNavigate }) {
  const list = EMERGENCY_HOTLINES.slice(0, 5);

  return (
    <PortalCard className="h-full" padding="p-5">
      <PortalSectionTitle
        action={
          <button type="button" onClick={() => onNavigate('contacts')} className="text-xs font-semibold text-safety">
            All contacts
          </button>
        }
      >
        Emergency Contacts
      </PortalSectionTitle>
      <ul className="space-y-2">
        {list.map((c) => (
          <li key={c.id}>
            <a
              href={`tel:${c.number}`}
              className="flex items-center justify-between gap-2 py-1.5 group touch-target"
            >
              <span className="text-sm text-portal-muted group-hover:text-portal-text transition-colors">
                {c.label}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-portal-text tabular-nums">
                {c.number}
                <Phone className="w-3.5 h-3.5 text-emergency opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </PortalCard>
  );
}
