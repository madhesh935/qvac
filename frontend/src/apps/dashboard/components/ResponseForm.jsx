import { useState } from 'react';

const QUICK_RESPONSES = [
  'Team dispatched. ETA 10 minutes. Stay where you are.',
  'Medical unit en route. Apply pressure to wounds.',
  'Rescue helicopter dispatched. Clear open area above.',
  'Help is on the way. Stay calm and conserve energy.',
  'Your location confirmed. ETA 15 minutes.',
];

export default function ResponseForm({ incident, onRespond }) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('ASSIGNED');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError('');
    try {
      await onRespond(incident._id, message.trim(), status);
      setSent(true);
      setMessage('');
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-gray-600 text-xs uppercase tracking-wider mb-2">
        Send Rescue Response
      </p>

      {/* Quick responses */}
      <div className="flex flex-wrap gap-1 mb-3">
        {QUICK_RESPONSES.map((r) => (
          <button
            key={r}
            onClick={() => setMessage(r)}
            type="button"
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 px-2 py-1 rounded-lg transition-colors border border-gray-700"
          >
            {r.slice(0, 22)}…
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a rescue response to send to the victim..."
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 resize-none transition-colors"
        />

        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-2 py-2 text-xs text-gray-300 focus:outline-none"
          >
            <option value="ASSIGNED">Mark Assigned</option>
            <option value="RESOLVED">Mark Resolved</option>
          </select>

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed rounded-xl text-sm font-bold transition-colors"
          >
            {loading ? '...' : sent ? '✅ Sent!' : '📤 Send Response'}
          </button>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}
      </form>
    </div>
  );
}
