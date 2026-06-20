import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'resqmesh_victim_profile';

const DEFAULT_PROFILE = {
  bloodGroup: '',
  conditions: '',
  allergies: '',
  medications: '',
  injuries: '',
  notes: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
};

export function useVictimProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : { ...DEFAULT_PROFILE };
    } catch {
      return { ...DEFAULT_PROFILE };
    }
  });

  const [familyNotifications, setFamilyNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('resqmesh_family_notifications') || '[]');
    } catch {
      return [];
    }
  });

  const saveProfile = useCallback((updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addFamilyNotification = useCallback((entry) => {
    setFamilyNotifications((prev) => {
      const next = [{ ...entry, id: Date.now(), at: new Date().toISOString() }, ...prev].slice(0, 20);
      localStorage.setItem('resqmesh_family_notifications', JSON.stringify(next));
      return next;
    });
  }, []);

  return { profile, saveProfile, familyNotifications, addFamilyNotification };
}

export function useNetworkStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

export function deriveRescueStage(report) {
  if (!report) return 0;
  if (report.status === 'RESOLVED') return 8;
  if (report.status === 'ASSIGNED' && report.response) return 5;
  if (report.status === 'ASSIGNED') return 4;
  if (report.advice || (report.priority && report.priority !== 'MEDIUM')) return 3;
  if (report.status === 'PENDING') return 2;
  return 1;
}

export const RESCUE_STAGES = [
  { id: 1, label: 'Request Submitted', short: 'Submitted' },
  { id: 2, label: 'Under Review', short: 'Review' },
  { id: 3, label: 'AI Assessment Complete', short: 'AI Triage' },
  { id: 4, label: 'Team Assigned', short: 'Assigned' },
  { id: 5, label: 'Rescue Team En Route', short: 'En Route' },
  { id: 6, label: 'Rescue Team Nearby', short: 'Nearby' },
  { id: 7, label: 'Rescue Team Arrived', short: 'Arrived' },
  { id: 8, label: 'Victim Rescued', short: 'Rescued' },
];

export function estimateEta(report) {
  if (report?.status === 'RESOLVED') return 'Complete';
  if (report?.response?.match(/ETA\s*(\d+)/i)) return report.response.match(/ETA\s*(\d+)/i)[1] + ' min';
  if (report?.status === 'ASSIGNED') return '12 min';
  if (report?.priority === 'CRITICAL') return '8–15 min';
  if (report?.priority === 'HIGH') return '15–25 min';
  return 'Calculating…';
}
