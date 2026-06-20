import ResponseForm from './ResponseForm';

const PRIORITY_STYLES = {
  CRITICAL: 'text-red-400 bg-red-900/30 border-red-700',
  HIGH: 'text-orange-400 bg-orange-900/30 border-orange-700',
  MEDIUM: 'text-yellow-400 bg-yellow-900/30 border-yellow-700',
  LOW: 'text-green-400 bg-green-900/30 border-green-700',
};

const STATUS_STYLES = {
  PENDING: 'text-gray-300 bg-gray-800 border-gray-700',
  ASSIGNED: 'text-blue-300 bg-blue-900/30 border-blue-700',
  RESOLVED: 'text-green-300 bg-green-900/30 border-green-700',
};

const STATUS_ICONS = { PENDING: '⏳', ASSIGNED: '🚑', RESOLVED: '✅' };

function Field({ label, children }) {
  return (
    <div>
      <p className="text-gray-600 text-xs uppercase tracking-wider mb-1.5">{label}</p>
      {children}
    </div>
  );
}

export default function IncidentDetails({ incident, onRespond, onClose }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
        <h2 className="font-semibold text-sm text-gray-300">Incident Details</h2>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Victim name */}
        <Field label="Victim">
          <p className="font-bold text-xl text-white">{incident.victim_name}</p>
        </Field>

        {/* Priority + Status badges */}
        <div className="flex gap-2 flex-wrap">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold ${
              PRIORITY_STYLES[incident.priority] || PRIORITY_STYLES.MEDIUM
            }`}
          >
            {incident.priority}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${
              STATUS_STYLES[incident.status] || STATUS_STYLES.PENDING
            }`}
          >
            {STATUS_ICONS[incident.status]} {incident.status}
          </span>
        </div>

        {/* Message */}
        <Field label="Emergency Message">
          <p className="text-white text-sm leading-relaxed bg-gray-800 rounded-xl p-3">
            {incident.message}
          </p>
        </Field>

        {/* Location */}
        {incident.latitude && incident.longitude && (
          <Field label="GPS Location">
            <a
              href={`https://www.openstreetmap.org/?mlat=${incident.latitude}&mlon=${incident.longitude}&zoom=16`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm font-mono flex items-center gap-1.5 transition-colors"
            >
              📍 {incident.latitude.toFixed(5)}, {incident.longitude.toFixed(5)}
              <span className="text-blue-600 text-xs">↗</span>
            </a>
          </Field>
        )}

        {/* AI Advice */}
        {incident.advice && (
          <Field label="AI Triage Advice">
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-3">
              <p className="text-yellow-300 text-sm leading-relaxed">
                🤖 {incident.advice}
              </p>
            </div>
          </Field>
        )}

        {/* Previous Response */}
        {incident.response && (
          <Field label="Response Sent">
            <div className="bg-green-900/20 border border-green-800 rounded-xl p-3">
              <p className="text-green-300 text-sm leading-relaxed">
                ✅ {incident.response}
              </p>
            </div>
          </Field>
        )}

        {/* Timestamp */}
        <Field label="Reported At">
          <p className="text-gray-400 text-sm">
            {new Date(incident.created_at).toLocaleString()}
          </p>
        </Field>

        {/* Packet ID */}
        <Field label="Packet ID">
          <p className="text-gray-600 text-xs font-mono">{incident.packet_id}</p>
        </Field>
      </div>

      {/* Response Form */}
      <div className="border-t border-gray-800 p-4 flex-shrink-0">
        <ResponseForm incident={incident} onRespond={onRespond} />
      </div>
    </div>
  );
}
