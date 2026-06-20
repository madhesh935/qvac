import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Send, CheckCircle2, Phone, Heart } from 'lucide-react';
import GlassCard, { SectionHeader } from './GlassCard';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

export default function FamilyComm({ profile, saveProfile, familyNotifications, addFamilyNotification, report }) {
  const [sent, setSent] = useState(false);

  const shareStatus = () => {
    const msg = report
      ? `ResQMesh Update: ${report.victim_name} — Status: ${report.status}, Priority: ${report.priority}. ${report.response || 'Rescue teams are responding.'}`
      : 'ResQMesh: Emergency report submitted. Help is on the way.';
    addFamilyNotification({
      contact: profile.emergencyContactName || 'Family',
      message: msg,
      method: 'Status Share',
    });
    if (profile.emergencyContactPhone) {
      window.open(`sms:${profile.emergencyContactPhone}?body=${encodeURIComponent(msg)}`, '_self');
    }
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-4">
      <GlassCard>
        <SectionHeader
          icon={Users}
          title="Family Communication"
          subtitle="Keep loved ones informed — reduce their anxiety too"
        />

        <div className="space-y-4 mb-6">
          <Input
            label="Emergency Contact Name"
            placeholder="e.g. Sarah Smith"
            value={profile.emergencyContactName}
            onChange={(e) => saveProfile({ emergencyContactName: e.target.value })}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={profile.emergencyContactPhone}
            onChange={(e) => saveProfile({ emergencyContactPhone: e.target.value })}
          />
          <Input
            label="Relationship"
            placeholder="e.g. Spouse, Parent, Sibling"
            value={profile.emergencyContactRelation}
            onChange={(e) => saveProfile({ emergencyContactRelation: e.target.value })}
          />
        </div>

        {profile.emergencyContactPhone && (
          <div className="flex items-center gap-3 p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/50 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center">
              <Heart className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-emerald-300 text-sm">{profile.emergencyContactName || 'Emergency Contact'}</p>
              <a href={`tel:${profile.emergencyContactPhone}`} className="text-emerald-400 font-bold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {profile.emergencyContactPhone}
              </a>
            </div>
          </div>
        )}

        <Button variant="primary" size="lg" className="w-full" icon={Send} onClick={shareStatus} loading={sent}>
          {sent ? 'Status Shared!' : 'Share Rescue Status with Family'}
        </Button>

        <Alert variant="info" className="mt-4">
          Opens SMS with a pre-filled update. Your family will know help is coming.
        </Alert>
      </GlassCard>

      {familyNotifications.length > 0 && (
        <GlassCard>
          <h3 className="font-bold text-portal-text mb-3">Notification History</h3>
          <div className="space-y-2">
            <AnimatePresence>
              {familyNotifications.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-[#0a1628] border border-portal-border"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-portal-muted">{n.contact} · {n.method}</span>
                    <time className="text-[10px] text-portal-muted ml-auto">
                      {new Date(n.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                  <p className="text-sm text-portal-muted leading-relaxed">{n.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
