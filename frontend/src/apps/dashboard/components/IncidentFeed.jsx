const PRIORITY_CONFIG = {
  CRITICAL: {
    border: 'border-l-red-500',
    badge: 'bg-red-900/60 text-red-300 border-red-700',
    dot: 'bg-red-500',
  },
  HIGH: {
    border: 'border-l-orange-500',
    badge: 'bg-orange-900/60 text-orange-300 border-orange-700',
    dot: 'bg-orange-500',
  },
  MEDIUM: {
    border: 'border-l-yellow-500',
    badge: 'bg-yellow-900/60 text-yellow-300 border-yellow-700',
    dot: 'bg-yellow-500',
  },
  LOW: {
    border: 'border-l-green-500',
    badge: 'bg-green-900/60 text-green-300 border-green-700',
    dot: 'bg-green-500',
  },
};

const STATUS_ICONS = { PENDING: '⏳', ASSIGNED: '🚑', RESOLVED: '✅' };

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function IncidentFeed({ incidents, selected, onSelect }) {
  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-600 text-sm">
        <div className="text-4xl mb-3">📭</div>
        <p className="font-medium">No incidents yet</p>
        <p className="text-gray-700 text-xs mt-1">Reports will appear here in real time</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-800/60">
      {incidents.map((incident) => {
        const cfg = PRIORITY_CONFIG[incident.priority] || PRIORITY_CONFIG.MEDIUM;
        const isSelected = selected?._id === incident._id;

        return (
          <button
            key={incident._id}
            onClick={() => onSelect(incident)}
            className={`w-full text-left px-4 py-3 border-l-2 transition-colors hover:bg-gray-800/40 ${
              isSelected
                ? `bg-gray-800/70 ${cfg.border}`
                : 'border-l-transparent'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-semibold text-sm text-white truncate">
                {incident.victim_name}
              </span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded border font-bold flex-shrink-0 ${cfg.badge}`}
              >
                {incident.priority}
              </span>
            </div>
            <p className="text-gray-400 text-xs line-clamp-2 mb-1.5 leading-relaxed">
              {incident.message}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>
                {STATUS_ICONS[incident.status]} {incident.status}
              </span>
              <span>·</span>
              <span>{timeAgo(incident.created_at)}</span>
              {incident.latitude && (
                <>
                  <span>·</span>
                  <span>📍</span>
                </>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
