import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const REPORT_KEY = 'resqmesh_active_report';

function readCachedReport() {
  try {
    const raw = localStorage.getItem(REPORT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCachedReport(report) {
  if (report) {
    localStorage.setItem(REPORT_KEY, JSON.stringify(report));
  } else {
    localStorage.removeItem(REPORT_KEY);
  }
}

export function useActiveReport(backendUrl) {
  const [report, setReportState] = useState(() => readCachedReport());
  const [hydrating, setHydrating] = useState(true);
  const [backendConnected, setBackendConnected] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const cached = readCachedReport();

      try {
        await axios.get(`${backendUrl}/`, { timeout: 5000 });
        if (!cancelled) setBackendConnected(true);
      } catch {
        if (!cancelled) setBackendConnected(false);
      }

      if (!cached?._id) {
        if (!cancelled) setHydrating(false);
        return;
      }

      try {
        const { data } = await axios.get(`${backendUrl}/api/report/${cached._id}`, {
          timeout: 8000,
        });
        if (!cancelled) {
          setReportState(data);
          writeCachedReport(data);
        }
      } catch {
        if (!cancelled && cached) setReportState(cached);
      } finally {
        if (!cancelled) setHydrating(false);
      }
    }

    hydrate();
    return () => { cancelled = true; };
  }, [backendUrl]);

  const setReport = useCallback((next) => {
    setReportState((prev) => {
      const value = typeof next === 'function' ? next(prev) : next;
      writeCachedReport(value);
      return value;
    });
  }, []);

  const clearReport = useCallback(() => {
    setReportState(null);
    writeCachedReport(null);
  }, []);

  return { report, setReport, clearReport, hydrating, backendConnected };
}

export function getInitialPhase() {
  try {
    const saved = sessionStorage.getItem('resqmesh_phase');
    if (saved) return saved;
    const cached = readCachedReport();
    if (cached && cached.status !== 'RESOLVED') return 'status';
  } catch { /* ignore */ }
  return 'home';
}

export function persistPhase(phase) {
  try {
    sessionStorage.setItem('resqmesh_phase', phase);
  } catch { /* ignore */ }
}
