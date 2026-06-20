import {
  Home,
  FileText,
  Activity,
  Radio,
  MapPin,
  BookOpen,
  Phone,
  Users,
  HeartPulse,
  Building2,
  HandHeart,
  Wifi,
  Settings,
} from 'lucide-react';

export const PORTAL_ROUTES = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'report', label: 'Report Emergency (SOS)', icon: FileText, sos: true },
  { id: 'status', label: 'Rescue Status', icon: Activity, requiresReport: true },
  { id: 'location', label: 'Location & Map', icon: MapPin },
  { id: 'contacts', label: 'Emergency Contacts', icon: Phone },
  { id: 'safety', label: 'Safety Guide', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const MOBILE_NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'report', label: 'Report', icon: FileText },
  { id: 'status', label: 'Status', icon: Activity },
  { id: 'location', label: 'Map', icon: MapPin },
];

export const ROUTE_TITLES = {
  home: 'ResQMesh Victim Portal',
  report: 'Report Emergency',
  status: 'Rescue Status',
  updates: 'Live Updates',
  location: 'Location & Map',
  safety: 'Safety Guide',
  contacts: 'Emergency Contacts',
  family: 'Family & Sharing',
  medical: 'Medical Information',
  resources: 'Resource Centers',
  community: 'Community Assistance',
  offline: 'Offline Status',
  settings: 'Settings',
};
