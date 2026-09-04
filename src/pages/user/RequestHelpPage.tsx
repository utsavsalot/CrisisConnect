import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle2, ChevronDown, MapPin, ShieldAlert, TimerReset } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { EmergencyNeedCategory, LocationCoordinates } from '../../types';
import { EmergencyCategoryCard } from '../../components/emergency/EmergencyCategoryCard';
import { LocationDetector } from '../../components/emergency/LocationDetector';
import { SOSLocationMap } from '../../components/emergency/SOSLocationMap';
import { RequestSubmissionAnimation } from '../../components/animations/RequestSubmissionAnimation';

const HOLD_DURATION = 1500;

export const RequestHelpPage: React.FC = () => {
  const { createEmergencyRequest } = useEmergency();
  const navigate = useNavigate();
  const holdTimer = useRef<number | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedNeeds, setSelectedNeeds] = useState<EmergencyNeedCategory[]>(['Medical Assistance']);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<LocationCoordinates>({ latitude: 40.7128, longitude: -74.006 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  const stopHold = () => {
    if (holdTimer.current) window.clearInterval(holdTimer.current);
    holdTimer.current = null;
    setHoldProgress(0);
  };

  const sendSOS = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const created = await createEmergencyRequest({
        needs: selectedNeeds.length ? selectedNeeds : ['Medical Assistance'],
        description: description.trim() || 'Urgent SOS sent. Assistance required at the reported location.',
        location,
      });
      setCreatedRequestId(created.id);
    } catch (error) {
      console.error('SOS request creation error:', error);
      setIsSubmitting(false);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`Unable to send the SOS. ${message}`);
    }
  };

  const startHold = () => {
    if (isSubmitting || holdTimer.current) return;
    const startedAt = Date.now();
    holdTimer.current = window.setInterval(() => {
      const progress = Math.min(((Date.now() - startedAt) / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
      if (progress >= 100) {
        stopHold();
        void sendSOS();
      }
    }, 20);
  };

  const toggleNeed = (category: EmergencyNeedCategory) => setSelectedNeeds((current) =>
    current.includes(category) ? current.filter((item) => item !== category) : [...current, category]
  );

  return (
    <div className="min-h-screen bg-[#f4f5f7] px-4 py-7 text-black sm:px-6 lg:px-8">
      {isSubmitting && <RequestSubmissionAnimation onComplete={() => navigate(`/requests/${createdRequestId || 'req-101'}`)} />}
      <main className="mx-auto max-w-2xl space-y-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-black shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"><ArrowLeft className="h-4 w-4 text-red-600" /> Back to Dashboard</button>
        <header className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-emergency-500 bg-emergency-600/20 text-emergency-400 shadow-emergency-glow"><AlertTriangle className="h-9 w-9 animate-pulse" /></div>
          <p className="font-mono text-xs font-bold uppercase tracking-[.2em] text-red-600">Emergency quick response</p>
          <h1 className="mt-2 font-display text-3xl font-black text-black sm:text-4xl">SEND AN SOS</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-700">Your location and selected emergency type are broadcast immediately to verified responders and NGO hubs.</p>
        </header>
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed text-red-700"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" /><p><strong>For a life-threatening emergency, call local emergency services (112/911) first.</strong> CrisisConnect is an additional community response network.</p></div>
        <section className="rounded-3xl border border-slate-200 bg-[#fffefa] p-4 shadow-[0_14px_40px_rgba(15,23,42,0.10)] sm:p-6">
          <div className="mb-4 flex items-center gap-2"><MapPin className="h-4 w-4 text-red-600" /><h2 className="font-display text-lg font-black text-black">Live incident location</h2><span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-red-600"><CheckCircle2 className="h-3.5 w-3.5" /> LIVE</span></div>
          <SOSLocationMap location={location} />
          <div className="mt-3"><LocationDetector location={location} onChange={setLocation} /></div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-[#fffefa] p-4 shadow-[0_14px_40px_rgba(15,23,42,0.10)] sm:p-6">
          <button type="button" onClick={() => setShowDetails((value) => !value)} className="flex w-full items-center justify-between text-left"><span><span className="font-display text-base font-black text-black">Add details</span><span className="ml-2 text-xs text-slate-600">Optional — SOS works without these</span></span><ChevronDown className={`h-5 w-5 text-red-600 transition-transform ${showDetails ? 'rotate-180' : ''}`} /></button>
          {showDetails && <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{(['Medical Assistance', 'Rescue', 'Blood', 'Medicine', 'Food', 'Shelter', 'Transportation', 'Water', 'Other'] as EmergencyNeedCategory[]).map((category) => <EmergencyCategoryCard key={category} category={category} selected={selectedNeeds.includes(category)} onToggle={toggleNeed} />)}</div>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="What happened? This is optional, but helpful for responders." className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-black placeholder:text-slate-500 focus:border-red-500 focus:outline-none" />
          </div>}
        </section>
        <section className="pb-4 text-center">
          <button type="button" data-emergency="true" onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold} className="emergency-cta relative w-full select-none overflow-hidden rounded-3xl border border-red-300/50 bg-emergency-600 px-5 py-7 font-display text-xl font-black uppercase tracking-wide shadow-emergency-glow transition-transform active:scale-[.98]"><span className="absolute inset-y-0 left-0 bg-white/25 transition-[width] duration-75" style={{ width: `${holdProgress}%` }} /><span className="relative flex items-center justify-center gap-3"><AlertTriangle className="h-7 w-7" /> {holdProgress ? 'Keep holding…' : 'Press & hold to send SOS'}</span></button>
          <p className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[11px] text-slate-600"><TimerReset className="h-3.5 w-3.5" /> Hold for 1.5 seconds to prevent accidental requests.</p>
        </section>
      </main>
    </div>
  );
};
