import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import IncidentFeed from './components/IncidentFeed';
import MapView from './components/MapView';
import IncidentDetails from './components/IncidentDetails';
import StatsCards from './components/StatsCards';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function DashboardApp() {
  const [incidents, setIncidents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    resolved: 0,
    critical: 0,
    high: 0,
  });
  const [connected, setConnected] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const refreshStats = () =>
    axios
      .get(`${BACKEND_URL}/api/statistics`)
      .then(({ data }) => setStats(data))
      .catch(console.error);

  useEffect(() => {
    // Load existing data
    axios
      .get(`${BACKEND_URL}/api/reports`)
      .then(({ data }) => setIncidents(data))
      .catch(console.error);
    refreshStats();

    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: Infinity,
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('new-report', (report) => {
      setIncidents((prev) => [report, ...prev]);
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1,
      }));
    });

    socket.on('priority-updated', ({ report_id, priority, advice, report }) => {
      setIncidents((prev) =>
        prev.map((i) => (i._id === report_id ? { ...i, priority, advice } : i))
      );
      setSelected((prev) =>
        prev?._id === report_id ? { ...prev, priority, advice } : prev
      );
      refreshStats();
    });

    socket.on('rescue-response', ({ report_id, response }) => {
      setIncidents((prev) =>
        prev.map((i) =>
          i._id === report_id ? { ...i, response, status: 'ASSIGNED' } : i
        )
      );
      setSelected((prev) =>
        prev?._id === report_id ? { ...prev, response, status: 'ASSIGNED' } : prev
      );
    });

    socket.on('status-updated', ({ report_id, status }) => {
      setIncidents((prev) =>
        prev.map((i) => (i._id === report_id ? { ...i, status } : i))
      );
      setSelected((prev) =>
        prev?._id === report_id ? { ...prev, status } : prev
      );
      refreshStats();
    });

    return () => socket.disconnect();
  }, []);

  const filteredIncidents =
    filter === 'ALL'
      ? incidents
      : incidents.filter(
          (i) => i.priority === filter || i.status === filter
        );

  const handleRespond = async (reportId, responseMessage, newStatus) => {
    const { data } = await axios.post(`${BACKEND_URL}/api/respond`, {
      report_id: reportId,
      response_message: responseMessage,
      status: newStatus,
    });
    return data;
  };

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-4 flex-shrink-0">
        <span className="text-2xl">📡</span>
        <div className="flex-1">
          <h1 className="font-bold text-lg leading-none tracking-tight">
            ResQMesh Command Center
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Disaster Response Operations Dashboard
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-xs hidden sm:block">
            {new Date().toLocaleTimeString()}
          </span>
          <span
            className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium ${
              connected
                ? 'bg-green-900/60 text-green-400 border border-green-800'
                : 'bg-red-900/60 text-red-400 border border-red-800'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                connected ? 'bg-green-400' : 'bg-red-400'
              }`}
            />
            {connected ? 'Live' : 'Reconnecting...'}
          </span>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="px-6 py-2.5 border-b border-gray-800 bg-gray-900/50 flex-shrink-0">
        <StatsCards stats={stats} />
      </div>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Incident Feed */}
        <div className="w-72 xl:w-80 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden flex-shrink-0">
          <div className="px-4 py-2.5 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
            <h2 className="font-semibold text-sm text-gray-300">
              Incidents{' '}
              <span className="text-gray-600 font-normal">
                ({filteredIncidents.length})
              </span>
            </h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 text-xs text-gray-300 border border-gray-700 rounded-lg px-2 py-1 focus:outline-none focus:border-gray-600"
            >
              <option value="ALL">All</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="PENDING">Pending</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto">
            <IncidentFeed
              incidents={filteredIncidents}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </div>

        {/* Center: Map */}
        <div className="flex-1 overflow-hidden">
          <MapView
            incidents={incidents}
            selectedIncident={selected}
            onSelectIncident={setSelected}
          />
        </div>

        {/* Right: Incident Details */}
        <div className="w-72 xl:w-80 bg-gray-900 border-l border-gray-800 flex flex-col overflow-hidden flex-shrink-0">
          {selected ? (
            <IncidentDetails
              incident={selected}
              onRespond={handleRespond}
              onClose={() => setSelected(null)}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm text-center px-6">
              <div>
                <div className="text-4xl mb-3">📋</div>
                <p className="font-medium text-gray-500">Select an incident</p>
                <p className="text-gray-700 text-xs mt-1">
                  Click a card or map marker to view details and respond
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
