import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Radio, Brain, Truck, MessageSquare, Clock, Flag, MapPin,
} from 'lucide-react';
import GlassCard, { SectionHeader } from './GlassCard';
import Timeline from '../ui/Timeline';
import { Activity } from 'lucide-react';

function formatTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function buildTimeline(report) {
  const events = [{
    id: '1', title: 'Emergency request received',
    description: 'Your SOS was transmitted through the mesh relay network.',
    time: formatTime(report.created_at), complete: true, icon: Radio,
  }];

  if (report.advice || (report.priority && report.priority !== 'MEDIUM')) {
    events.push({
      id: '2', title: `Priority classified as ${report.priority}`,
      description: report.advice || 'AI triage assessment complete.',
      complete: true, icon: Brain,
    });
    events.push({
      id: '3', title: 'Nearest rescue team identified',
      description: 'Command center matched your location to the nearest available unit.',
      complete: true, icon: MapPin,
    });
  } else {
    events.push({
      id: '2p', title: 'AI assessment in progress',
      description: 'Analyzing severity and routing to appropriate teams…',
      complete: false, active: true, icon: Brain,
    });
  }

  if (report.status === 'ASSIGNED' || report.response) {
    events.push({
      id: '4', title: 'Team Alpha dispatched',
      description: 'Rescue team has been dispatched to your coordinates.',
      complete: true, icon: Truck, unread: !!report.response,
    });
  }

  if (report.response) {
    events.push({
      id: '5', title: 'Rescue team message received',
      description: report.response,
      complete: true, icon: MessageSquare, unread: true,
    });
  } else if (report.status !== 'RESOLVED') {
    events.push({
      id: 'w', title: 'Rescue team coordinating',
      description: 'Awaiting confirmation from command center…',
      complete: false, active: true, icon: Clock,
    });
  }

  if (report.status === 'RESOLVED') {
    events.push({
      id: '6', title: 'Victim rescued successfully',
      description: 'Your case has been marked as resolved. You are safe.',
      complete: true, icon: Flag,
    });
  }

  return events;
}

export default function LiveUpdates({ report }) {
  const timeline = useMemo(() => buildTimeline(report), [report]);

  return (
    <GlassCard>
      <SectionHeader
        icon={Activity}
        title="Live Rescue Updates"
        subtitle="Real-time activity from command center"
        action={
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        }
      />
      <Timeline items={timeline} />
    </GlassCard>
  );
}
