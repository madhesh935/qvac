import {
  Waves, Activity, Flame, Wind, AlertTriangle, HeartPulse, Search,
} from 'lucide-react';

export const SAFETY_CATEGORIES = [
  { id: 'flood', label: 'Flood Safety', icon: Waves, color: 'bg-blue-100 text-blue-700' },
  { id: 'earthquake', label: 'Earthquake Safety', icon: Activity, color: 'bg-amber-100 text-amber-800' },
  { id: 'fire', label: 'Fire Safety', icon: Flame, color: 'bg-orange-100 text-orange-700' },
  { id: 'medical', label: 'Medical First Aid', icon: HeartPulse, color: 'bg-red-100 text-red-700' },
  { id: 'cyclone', label: 'Cyclone Safety', icon: Wind, color: 'bg-indigo-100 text-indigo-700' },
  { id: 'landslide', label: 'Landslide Safety', icon: AlertTriangle, color: 'bg-stone-100 text-stone-700' },
];

export const SAFETY_GUIDES = {
  flood: {
    title: 'Flood Safety',
    tips: [
      'Move to higher ground immediately — do not wait for instructions if water is rising.',
      'Avoid walking or driving through flood water. Just 15 cm of moving water can knock you down.',
      'Stay away from bridges, rivers, and streams during heavy rain.',
      'Turn off electricity at the main breaker if water enters your home.',
      'Signal for help from rooftops or upper floors with bright cloth or flashlight.',
    ],
  },
  earthquake: {
    title: 'Earthquake Safety',
    tips: [
      'Drop, Cover, and Hold On. Get under sturdy furniture and protect your head.',
      'Stay indoors until shaking stops. Do not use elevators.',
      'If outdoors, move away from buildings, trees, and power lines.',
      'If trapped, tap on pipes or walls so rescuers can locate you.',
      'Check for injuries and gas leaks after shaking stops.',
    ],
  },
  fire: {
    title: 'Fire Safety',
    tips: [
      'Stay low where air is cleaner — crawl below smoke level.',
      'Feel doors before opening. If hot, find another exit.',
      'Stop, Drop, and Roll if your clothing catches fire.',
      'Never re-enter a burning building.',
      'Signal location from windows if trapped on upper floors.',
    ],
  },
  medical: {
    title: 'Medical First Aid',
    tips: [
      'Apply direct pressure to stop bleeding. Elevate the wound if possible.',
      'Keep injured person still and warm. Do not move suspected spinal injuries.',
      'For burns, cool with clean water for 20 minutes. Do not apply ice.',
      'If unconscious but breathing, place in recovery position.',
      'Share your blood type and allergies with rescue teams when they arrive.',
    ],
  },
  cyclone: {
    title: 'Cyclone Safety',
    tips: [
      'Stay indoors in the strongest room — away from windows.',
      'Keep emergency supplies: water, food, flashlight, first aid.',
      'Do not go outside during the eye of the storm — winds will return.',
      'Listen to battery-powered radio for official updates.',
      'After the storm, watch for downed power lines and flooding.',
    ],
  },
  landslide: {
    title: 'Landslide Safety',
    tips: [
      'Move away from slopes, hillsides, and riverbanks immediately.',
      'Watch for cracks in ground, tilting trees, or unusual water flow.',
      'If caught in a slide, curl into a tight ball and protect your head.',
      'Evacuate to stable ground and stay there until authorities clear the area.',
      'Report landslide locations to disaster control so others can avoid the area.',
    ],
  },
};

export const EMERGENCY_HOTLINES = [
  { id: 'police', label: 'Police', number: '100', icon: 'shield', status: 'Available', color: 'blue' },
  { id: 'fire', label: 'Fire Department', number: '101', icon: 'flame', status: 'Available', color: 'orange' },
  { id: 'ambulance', label: 'Ambulance', number: '108', icon: 'heart', status: '24/7 Active', color: 'green' },
  { id: 'disaster', label: 'Disaster Control Room', number: '1078', icon: 'radio', status: 'Available', color: 'amber' },
  { id: 'relief', label: 'Local Relief Team', number: '1070', icon: 'truck', status: 'On Standby', color: 'indigo' },
  { id: 'hotline', label: 'National Emergency Hotline', number: '112', icon: 'phone', status: '24/7 Active', color: 'red' },
];

export function mockResources(lat, lng) {
  if (!lat || !lng) return [];
  const offsets = [
    { type: 'Shelter', name: 'Community Relief Shelter', dist: '1.2 km', avail: 'Open', icon: '🏠' },
    { type: 'Hospital', name: 'District General Hospital', dist: '2.8 km', avail: 'Emergency Open', icon: '🏥' },
    { type: 'Relief Camp', name: 'Central Relief Camp Alpha', dist: '3.5 km', avail: 'Accepting', icon: '⛺' },
    { type: 'Food', name: 'Food Distribution Point B', dist: '0.9 km', avail: 'Open until 8 PM', icon: '🍽️' },
    { type: 'Water', name: 'Clean Water Station', dist: '1.5 km', avail: 'Operational', icon: '💧' },
    { type: 'Medical', name: 'Mobile Medical Aid Station', dist: '2.1 km', avail: 'Active', icon: '🚑' },
  ];
  return offsets.map((r, i) => ({
    ...r,
    id: i,
    lat: lat + (i - 2) * 0.008,
    lng: lng + (i % 2 === 0 ? 0.006 : -0.006),
  }));
}

export function mockCommunity(lat, lng) {
  return [
    { id: 1, name: 'Volunteer Team Delta', role: 'Search & Rescue', dist: '1.8 km', active: true },
    { id: 2, name: 'Relief Corps Unit 7', role: 'Medical Aid', dist: '2.4 km', active: true },
    { id: 3, name: 'Community Kitchen #3', role: 'Food Distribution', dist: '0.7 km', active: true },
    { id: 4, name: 'Neighbourhood Watch', role: 'Local Support', dist: '0.5 km', active: false },
  ];
}
