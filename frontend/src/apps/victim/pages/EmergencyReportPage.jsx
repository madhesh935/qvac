import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, MessageSquareWarning, MapPin, ClipboardCheck,
  ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle,
  Zap, Activity, Shield, Heart, Phone, Target,
  Radio, Clock, Info,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Alert from '../components/ui/Alert';
import ProgressSteps from '../components/ui/ProgressSteps';

const STEPS = [
  { id: 'personal',  label: 'Personal' },
  { id: 'details',   label: 'Emergency' },
  { id: 'location',  label: 'Location' },
  { id: 'review',    label: 'Submit' },
];

const SEVERITY_OPTIONS = [
  { id: 'CRITICAL', label: 'Life Threatening', desc: 'Immediate danger to life',     icon: Zap,      activeBg: 'bg-gradient-to-br from-red-600 to-red-700',     activeText: 'text-white',      border: 'border-red-500',    ring: 'ring-red-500/30',    bg: 'bg-red-50',     textColor: 'text-red-700' },
  { id: 'HIGH',     label: 'Serious Injury',   desc: 'Major injury or danger',        icon: Activity, activeBg: 'bg-gradient-to-br from-orange-500 to-orange-600', activeText: 'text-white',      border: 'border-orange-500', ring: 'ring-orange-500/30', bg: 'bg-orange-50',  textColor: 'text-orange-700' },
  { id: 'MEDIUM',   label: 'Needs Help Soon',  desc: 'Moderate situation',            icon: Shield,   activeBg: 'bg-gradient-to-br from-amber-400 to-amber-500',   activeText: 'text-amber-900',  border: 'border-amber-400',  ring: 'ring-amber-400/30',  bg: 'bg-amber-50',   textColor: 'text-amber-700' },
  { id: 'LOW',      label: 'Non-Urgent',       desc: 'Minor assistance needed',       icon: Heart,    activeBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', activeText: 'text-white',   border: 'border-emerald-500',ring: 'ring-emerald-500/30',bg: 'bg-emerald-50', textColor: 'text-emerald-700' },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

function StepHeader({ icon: Icon, iconBg, iconColor, title, subtitle }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shrink-0 border border-slate-200/50`}>
        <Icon className={`w-6 h-6 ${iconColor}`} aria-hidden />
      </div>
      <div>
        <h2 className="font-display font-bold text-xl text-portal-text leading-tight">{title}</h2>
        <p className="text-sm text-portal-muted mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

/* ── Summary panel shown on RHS on desktop ── */
function SummaryPanel({ step, name, severity, message, location, locationError }) {
  const sev = SEVERITY_OPTIONS.find((s) => s.id === severity);
  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden h-fit sticky top-24">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100" style={{ background: 'linear-gradient(135deg,#0F172A,#1E293B)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emergency flex items-center justify-center">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">SOS Summary</p>
            <p className="text-slate-400 text-[10px]">Preview before sending</p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="divide-y divide-slate-100">
        {/* Name */}
        <div className="px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Victim Name</p>
          <p className="text-sm font-semibold text-slate-800">{name || <span className="text-slate-300 font-normal italic">Not entered yet</span>}</p>
        </div>

        {/* Severity */}
        <div className="px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Severity Level</p>
          {sev ? (
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${sev.activeBg} ${sev.activeText}`}>
              <sev.icon className="w-3 h-3" />
              {sev.label}
            </span>
          ) : (
            <span className="text-slate-300 text-sm italic">Not selected</span>
          )}
        </div>

        {/* Message */}
        <div className="px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Emergency Message</p>
          <p className="text-sm text-slate-700 leading-relaxed line-clamp-4">
            {message || <span className="text-slate-300 font-normal italic">Not entered yet</span>}
          </p>
          {message && (
            <p className={`text-[10px] font-semibold mt-1.5 ${message.length >= 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {message.length} chars · {message.trim().split(' ').filter(Boolean).length} words
            </p>
          )}
        </div>

        {/* Location */}
        <div className="px-5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">GPS Location</p>
          {location ? (
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified
              </span>
              <p className="font-mono text-xs text-slate-600 mt-1.5">
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </p>
            </div>
          ) : (
            <span className="text-amber-600 text-xs font-semibold">{locationError ? 'Unavailable' : 'Acquiring…'}</span>
          )}
        </div>
      </div>

      {/* Step progress */}
      <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">Form Progress</p>
        <div className="space-y-1.5">
          {STEPS.map((s, i) => {
            const stepNum = i + 1;
            const done = stepNum < step;
            const current = stepNum === step;
            return (
              <div key={s.id} className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black border ${
                  done ? 'bg-emerald-500 border-emerald-500 text-white'
                       : current ? 'bg-emergency border-emergency text-white'
                       : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {done ? <CheckCircle2 className="w-3 h-3" /> : stepNum}
                </div>
                <span className={`text-xs font-semibold ${done ? 'text-emerald-600' : current ? 'text-emergency' : 'text-slate-400'}`}>
                  {s.label}
                </span>
                {current && <span className="ml-auto text-[10px] font-bold text-emergency bg-red-50 px-1.5 py-0.5 rounded-full border border-red-100">Current</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function EmergencyReportPage({ onSubmit, location, locationError, submitting, error, onBack }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateStep = (s) => {
    const errors = {};
    if (s === 1 && !name.trim()) errors.name = 'Please enter your name so rescue teams can identify you.';
    if (s === 2 && !message.trim()) errors.message = 'Please describe your emergency situation.';
    if (s === 2 && message.trim().length < 10) errors.message = 'Please provide more detail (at least 10 characters).';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goNext = () => { if (!validateStep(step)) return; setDirection(1); setStep((s) => Math.min(s + 1, 4)); };
  const goPrev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };

  const handleFinalSubmit = async () => {
    if (!validateStep(2)) { setStep(2); return; }
    setSubmitted(true);
    await onSubmit({ victim_name: name.trim(), message: message.trim() });
  };

  /* ── Transmitting screen ── */
  if (submitted && !error && submitting) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="text-center max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative w-28 h-28 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-emergency/10 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-emergency/15 animate-ping" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-4 rounded-full bg-emergency/20 animate-ping" style={{ animationDelay: '0.4s' }} />
            <div className="absolute inset-0 rounded-full bg-emergency flex items-center justify-center shadow-sos">
              <span className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-portal-text mb-2">Transmitting SOS</h2>
          <p className="text-portal-muted text-base leading-relaxed mb-6">
            Sending your emergency report through the mesh relay network to rescue teams…
          </p>
          <div className="flex items-center justify-center gap-2 bg-amber-50 rounded-2xl px-5 py-3 border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">Stay where you are. Do not move.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const selectedSeverity = SEVERITY_OPTIONS.find((s) => s.id === severity);

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-portal-card border border-portal-border text-portal-muted text-sm font-semibold hover:bg-white/[0.04] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </button>
        <div>
          <h1 className="font-display font-bold text-xl text-portal-text">Emergency Report Form</h1>
          <p className="text-sm text-portal-muted">Step {step} of 4 · {STEPS[step - 1]?.label}</p>
        </div>
      </div>

      {/* ── Main two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Form area (2/3 width) ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Progress */}
          <div className="bg-portal-card rounded-2xl p-5 border border-portal-border">
            <ProgressSteps steps={STEPS} currentStep={step} />
          </div>

          <div className="bg-portal-card rounded-2xl border border-portal-border overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="p-6"
              >
                {/* ── Step 1: Personal ── */}
                {step === 1 && (
                  <section aria-labelledby="step-personal">
                    <StepHeader icon={User} iconBg="bg-blue-100" iconColor="text-safety-600" title="Personal Information" subtitle="Who should rescue teams ask for?" />
                    <div className="max-w-md">
                      <Input
                        label="Your Full Name"
                        placeholder="e.g. Arjun Sharma"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: undefined })); }}
                        error={fieldErrors.name}
                        required
                        autoComplete="name"
                        autoFocus
                        prefix={User}
                      />
                      <p className="mt-3 text-xs text-slate-500 bg-blue-50 rounded-xl p-3 border border-blue-100">
                        💡 Your name helps rescue teams communicate directly with you during the response.
                      </p>
                    </div>
                  </section>
                )}

                {/* ── Step 2: Emergency Details ── */}
                {step === 2 && (
                  <section aria-labelledby="step-details">
                    <StepHeader icon={MessageSquareWarning} iconBg="bg-red-100" iconColor="text-emergency" title="Emergency Details" subtitle="Describe your situation as clearly as possible" />
                    <div className="space-y-5">
                      <div>
                        <p className="text-sm font-semibold text-slate-700 mb-3">How urgent is this situation?</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5" role="radiogroup" aria-label="Emergency severity">
                          {SEVERITY_OPTIONS.map((opt) => {
                            const Icon = opt.icon;
                            const isSelected = severity === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                onClick={() => setSeverity(opt.id)}
                                className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                                  isSelected
                                    ? `${opt.activeBg} ${opt.border} ring-2 ${opt.ring} ring-offset-1`
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? opt.activeText : opt.textColor}`} strokeWidth={2.5} />
                                  <p className={`font-bold text-sm ${isSelected ? opt.activeText : 'text-slate-800'}`}>{opt.label}</p>
                                </div>
                                <p className={`text-xs ${isSelected ? opt.activeText + ' opacity-80' : 'text-slate-500'}`}>{opt.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <Textarea
                        label="Describe Your Emergency"
                        placeholder="e.g. I am trapped in the building basement. One person has a deep cut. We are 4 people total. Water is rising fast."
                        value={message}
                        onChange={(e) => { setMessage(e.target.value); setFieldErrors((p) => ({ ...p, message: undefined })); }}
                        error={fieldErrors.message}
                        hint="Include: exact location, number of people, injuries, immediate dangers."
                        required
                        rows={5}
                      />
                      {message.trim().length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className={`font-semibold ${message.length >= 10 ? 'text-emerald-600' : 'text-amber-600'}`}>{message.length} chars</span>
                          <span>·</span>
                          <span>{message.trim().split(' ').filter(Boolean).length} words</span>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* ── Step 3: Location ── */}
                {step === 3 && (
                  <section aria-labelledby="step-location">
                    <StepHeader icon={Target} iconBg="bg-emerald-100" iconColor="text-emerald-600" title="Location Verification" subtitle="Confirm your GPS coordinates" />
                    {locationError ? (
                      <Alert variant="warning" title="GPS not available">
                        {locationError}. Your report will still be sent — describe your location clearly in the message.
                      </Alert>
                    ) : location ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-emerald-50 rounded-2xl px-4 py-3.5 border border-emerald-200">
                          <div className="w-9 h-9 rounded-xl bg-emerald-200 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-emerald-900">Location Verified</p>
                            <p className="text-xs text-emerald-700">GPS coordinates will be attached to your emergency report</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Latitude</p>
                            <p className="font-mono font-bold text-lg text-slate-800">{location.latitude.toFixed(6)}</p>
                          </div>
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Longitude</p>
                            <p className="font-mono font-bold text-lg text-slate-800">{location.longitude.toFixed(6)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Accuracy depends on your device GPS signal. Rescue teams will use these coordinates to locate you on their live map.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="h-14 bg-slate-200 rounded-2xl animate-shimmer" />
                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-20 bg-slate-200 rounded-2xl animate-shimmer" />
                          <div className="h-20 bg-slate-200 rounded-2xl animate-shimmer" style={{ animationDelay: '0.15s' }} />
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* ── Step 4: Review ── */}
                {step === 4 && (
                  <section aria-labelledby="step-review">
                    <StepHeader icon={ClipboardCheck} iconBg="bg-slate-100" iconColor="text-slate-600" title="Review & Submit" subtitle="Verify your information before sending SOS" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-50 rounded-2xl px-4 py-3.5 border border-slate-200">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Name</p>
                        <p className="font-semibold text-base text-slate-900">{name}</p>
                      </div>
                      <div className={`flex items-center justify-between rounded-2xl px-4 py-3.5 border-2 ${selectedSeverity?.border} ${selectedSeverity?.bg}`}>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Severity</p>
                          <p className={`font-bold text-base mt-0.5 ${selectedSeverity?.textColor}`}>{selectedSeverity?.label}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${selectedSeverity?.activeBg} ${selectedSeverity?.activeText}`}>{severity}</span>
                      </div>
                      <div className="md:col-span-2 bg-slate-50 rounded-2xl px-4 py-3.5 border border-slate-200">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Emergency Message</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{message}</p>
                      </div>
                      <div className="md:col-span-2 bg-slate-50 rounded-2xl px-4 py-3.5 border border-slate-200">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">GPS Location</p>
                        <p className="font-mono text-sm text-slate-700">
                          {location
                            ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
                            : 'Not available — describe location in message'}
                        </p>
                      </div>
                    </div>
                    {error && <Alert variant="error" title="Submission failed" className="mb-3" animate>{error}</Alert>}
                    <Alert variant="info">
                      By submitting, your report will be transmitted to the nearest rescue command center via the mesh relay network. This data is encrypted and used only for emergency response.
                    </Alert>
                  </section>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Navigation buttons ── */}
            <div className="flex gap-3 px-6 pb-6">
              {step > 1 ? (
                <Button variant="outline" size="lg" onClick={goPrev} icon={ChevronLeft} className="flex-1">Back</Button>
              ) : (
                <Button variant="ghost" size="lg" onClick={onBack} className="flex-1">Cancel</Button>
              )}
              {step < 4 ? (
                <Button variant="secondary" size="lg" onClick={goNext} className="flex-[2]">
                  Continue <ChevronRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button variant="primary" size="lg" onClick={handleFinalSubmit} loading={submitting} className="flex-[2]" icon={AlertTriangle}>
                  Send SOS Now
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Summary panel (1/3 width, desktop only) ── */}
        <div className="hidden lg:block">
          <SummaryPanel
            step={step}
            name={name}
            severity={severity}
            message={message}
            location={location}
            locationError={locationError}
          />

          {/* Tips below summary */}
          <div className="mt-4 rounded-2xl overflow-hidden border border-amber-200 shadow-card">
            <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600" />
              <p className="font-bold text-sm text-amber-900">While Filling the Form</p>
            </div>
            <div className="bg-white p-4 space-y-2.5">
              {[
                'Stay calm and fill in as much detail as possible.',
                'GPS will be auto-attached if your device allows it.',
                'Your report is sent immediately after Step 4.',
                'Rescue teams respond in order of severity.',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-[10px] font-black text-amber-700 shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
