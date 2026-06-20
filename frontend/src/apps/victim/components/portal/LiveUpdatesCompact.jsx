import { useMemo } from 'react';
import { Radio, Brain, Truck, MessageSquare, Clock, Flag, MapPin } from 'lucide-react';
import PortalCard, { PortalSectionTitle } from './PortalCard';

function formatTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function buildFeed(report) {
  const items = [
    {
      id: 1,
      icon: Radio,
      color: 'text-safety',
      title: 'Emergency request received',
      time: formatTime(report.created_at),
    },
  ];
  if (report.advice || report.priority !== 'MEDIUM') {
    items.push({
      id: 2,
      icon: Brain,
      color: 'text-warning',
      title: `Priority classified as ${report.priority}`,
      time: formatTime(report.created_at),
    });
    items.push({
      id: 3,
      icon: MapPin,
      color: 'text-safety',
      title: 'Nearest rescue team identified',
      time: formatTime(report.created_at),
    });
  }
  if (report.status === 'ASSIGNED' || report.response) {
    items.push({
      id: 4,
      icon: Truck,
      color: 'text-success',
      title: 'Team Alpha dispatched',
      time: formatTime(report.created_at),
    });
    items.push({
      id: 5,
      icon: Truck,
      color: 'text-success',
      title: 'Rescue team is on the way to your location',
      time: formatTime(report.created_at),
      highlight: true,
    });
  }
  if (report.response) {
    items.push({
      id: 6,
      icon: MessageSquare,
      color: 'text-portal-text',
      title: report.response,
      time: formatTime(report.created_at),
    });
  }
  if (report.status === 'RESOLVED') {
    items.push({
      id: 7,
      icon: Flag,
      color: 'text-success',
      title: 'Victim rescued successfully',
      time: formatTime(report.created_at),
    });
  }
  if (!report.response && report.status === 'PENDING') {
    items.push({
      id: 'w',
      icon: Clock,
      color: 'text-portal-muted',
      title: 'Awaiting command center response',
      time: '—',
    });
  }
  return items;
}

export default function LiveUpdatesCompact({ report }) {
  const feed = useMemo(() => buildFeed(report), [report]);

  return (
    <PortalCard className="h-full flex flex-col" padding="p-5">
      <PortalSectionTitle>Live Updates</PortalSectionTitle>
      <ul className="space-y-3 flex-1 overflow-y-auto max-h-[280px] pr-1">
        {feed.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.id}
              className={`flex gap-3 text-sm ${item.highlight ? 'bg-safety/10 -mx-2 px-2 py-2 rounded-lg border border-safety/20' : ''}`}
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${item.color}`} strokeWidth={2} />
              <div className="min-w-0 flex-1">
                <p className="text-portal-text leading-snug">{item.title}</p>
                <time className="text-[11px] text-portal-muted tabular-nums">{item.time}</time>
              </div>
            </li>
          );
        })}
      </ul>
    </PortalCard>
  );
}
