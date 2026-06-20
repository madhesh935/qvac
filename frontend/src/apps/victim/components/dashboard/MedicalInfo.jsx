import { HeartPulse } from 'lucide-react';
import GlassCard, { SectionHeader } from './GlassCard';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import { PriorityBadge } from '../ui/Badge';

export default function MedicalInfo({ profile, saveProfile, report }) {
  const fields = [
    { key: 'bloodGroup', label: 'Blood Group', placeholder: 'e.g. O+' },
    { key: 'conditions', label: 'Medical Conditions', placeholder: 'Diabetes, asthma…' },
    { key: 'allergies', label: 'Allergies', placeholder: 'Penicillin, nuts…' },
    { key: 'medications', label: 'Current Medications', placeholder: 'List medications' },
    { key: 'injuries', label: 'Current Injuries', placeholder: 'Describe visible injuries' },
    { key: 'notes', label: 'Emergency Notes', placeholder: 'Additional info for medics', textarea: true },
  ];

  return (
    <div className="space-y-4">
      <GlassCard glow>
        <SectionHeader
          icon={HeartPulse}
          title="Medical Information"
          subtitle="Shared with rescue teams to prioritize your care"
        />
        {report?.priority && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-950/40 rounded-xl border border-red-900/50">
            <span className="text-sm font-semibold text-portal-text">Medical Priority:</span>
            <PriorityBadge priority={report.priority} />
          </div>
        )}
        <div className="space-y-4">
          {fields.map(({ key, label, placeholder, textarea }) =>
            textarea ? (
              <Textarea
                key={key}
                label={label}
                placeholder={placeholder}
                value={profile[key]}
                onChange={(e) => saveProfile({ [key]: e.target.value })}
                rows={3}
              />
            ) : (
              <Input
                key={key}
                label={label}
                placeholder={placeholder}
                value={profile[key]}
                onChange={(e) => saveProfile({ [key]: e.target.value })}
              />
            )
          )}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Saved locally on your device and displayed to rescue operators during triage.
        </p>
      </GlassCard>
    </div>
  );
}
