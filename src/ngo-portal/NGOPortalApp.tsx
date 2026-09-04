import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Bell, Building2, CheckCircle2, Clock3, LogOut, MapPin, MessageSquare, Navigation, Phone, Send, ShieldCheck, UserRound, Package, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { useChat } from '../context/ChatContext';
import { EmergencyRequest, EmergencyNeedCategory, ChatMessage } from '../types';
import { SOSLocationMap } from '../components/emergency/SOSLocationMap';
import { runSimulation } from '../services/simulationService';
import { ResourceManagement } from '../pages/ngo/ResourceManagement';
import { WhatIfAnalysis } from '../components/emergency/WhatIfAnalysis';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { PriorityBreakdownModal } from '../components/emergency/PriorityBreakdownModal';
import { LanguageToggle } from '../components/ui/LanguageToggle';

const needs: EmergencyNeedCategory[] = ['Medical Assistance', 'Food', 'Rescue', 'Blood', 'Medicine', 'Shelter', 'Transportation', 'Water', 'Other'];

type FormState = {
  organizationName: string;
  registrationId: string;
  email: string;
  phone: string;
  password: string;
  area: string;
  services: EmergencyNeedCategory[];
  address: string;
};

const initialForm: FormState = {
  organizationName: '', registrationId: '', email: '', phone: '', password: '', area: '', services: ['Medical Assistance'], address: ''
};

const distanceFrom = (request: EmergencyRequest, latitude: number, longitude: number) => {
  const latitudeDelta = (request.location.latitude - latitude) * 111;
  const longitudeDelta = (request.location.longitude - longitude) * 85;
  return Math.sqrt(latitudeDelta ** 2 + longitudeDelta ** 2);
};

const formatTime = (value: string) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const NGOPortalApp: React.FC = () => {
  const { currentUser, role, login, signup, logout } = useAuth();
  const { requests, acceptRequest, notifications, markNotificationAsRead } = useEmergency();
  const { getMessages, sendMessage, subscribeToChat } = useChat();
  const [currentView, setCurrentView] = useState<'dashboard' | 'resources'>('dashboard');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState<FormState>(initialForm);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [simulationState, setSimulationResult] = useState<Awaited<ReturnType<typeof runSimulation>> | null>(null);
  const simulationResult = simulationState as NonNullable<typeof simulationState>;
const [simulating, setSimulating] = useState(false);
const [simulationError, setSimulationError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const ngo = currentUser && 'orgName' in currentUser ? currentUser : null;
  const activeRequests = useMemo(() => {
    const latitude = ngo?.location.latitude || 18.5204;
    const longitude = ngo?.location.longitude || 73.8567;
    return requests
      .filter((request) => request.status === 'active' || request.acceptedBy === ngo?.uid)
      .map((request) => ({ ...request, distanceKm: Number(distanceFrom(request, latitude, longitude).toFixed(1)) }))
      .sort((a, b) => {
        const priorityDiff = (b.priorityScore || 0) - (a.priorityScore || 0);
        if (priorityDiff !== 0) return priorityDiff;
        return a.distanceKm - b.distanceKm;
      });
  }, [requests, ngo]);

  const selectedRequest = requests.find((request) => request.id === selectedId);
  const isAcceptedByThisNgo = Boolean(selectedRequest?.acceptedBy === ngo?.uid);

  useEffect(() => {
    if (!selectedId && activeRequests.length > 0) {
      const acceptedMission = activeRequests.find((request) => request.acceptedBy === ngo?.uid);
      setSelectedId((acceptedMission || activeRequests[0]).id);
    }
  }, [activeRequests, selectedId, ngo?.uid]);

  useEffect(() => {
    if (!selectedId || !isAcceptedByThisNgo) {
      setMessages([]);
      return;
    }
    setMessages(getMessages(selectedId));
    return subscribeToChat(selectedId, setMessages);
  }, [selectedId, isAcceptedByThisNgo, getMessages, subscribeToChat]);

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError('');
    try {
      await login(loginEmail, loginPassword);
      if (role !== 'ngo' && !('orgName' in (currentUser || {}))) setAuthError('This portal is for registered NGOs. Please use an NGO account.');
    } catch {
      setAuthError('Unable to sign in. Check the email and password, then try again.');
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError('');
    if (!form.services.length) {
      setAuthError('Select at least one emergency service.');
      return;
    }
    try {
      await signup({
        name: form.organizationName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'ngo',
        orgType: 'Humanitarian Relief',
        registrationId: form.registrationId,
        operatingArea: form.area,
        emergencyServices: form.services,
        address: form.address,
        location: { latitude: 18.5204, longitude: 73.8567, address: form.address || form.area },
      });
    } catch {
      setAuthError('Unable to register this organization. Please check the entered details.');
    }
  };
  const handleSimulation = async () => {
  setSimulating(true);
  setSimulationError('');

  try {
    const result = await runSimulation();
    setSimulationResult(result);
  } catch (error) {
    console.error('Simulation failed:', error);
    setSimulationError(
      error instanceof Error
        ? error.message
        : 'Unable to run simulation.'
    );
  } finally {
    setSimulating(false);
  }
};

  const handleAccept = async (request: EmergencyRequest) => {
    await acceptRequest(request.id);
    setSelectedId(request.id);
  };


  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedId || !messageText.trim() || sending) return;
    setSending(true);
    try {
      const sent = await sendMessage(selectedId, messageText.trim());
      setMessages((current) => current.some((message) => message.id === sent.id) ? current : [...current, sent]);
      setMessageText('');
    } finally {
      setSending(false);
    }
  };

  if (!ngo || role !== 'ngo') {
    return <AuthScreen mode={mode} setMode={setMode} form={form} updateForm={updateForm} loginEmail={loginEmail} loginPassword={loginPassword} setLoginEmail={setLoginEmail} setLoginPassword={setLoginPassword} error={authError} onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            {currentView === 'resources' ? (
              <button onClick={() => setCurrentView('dashboard')} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"><ArrowLeft className="h-5 w-5" /></button>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white"><AlertTriangle className="h-5 w-5" /></div>
            )}
            <div><p className="font-display text-lg font-black tracking-wide">CRISIS<span className="text-red-600">CONNECT</span></p><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">NGO operations portal</p></div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <div className="relative">
              <button onClick={() => setShowNotifications((visible) => !visible)} className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Open notifications">
                <Bell className="h-4 w-4" />
                {notifications.some((notification) => !notification.read) && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-600" />}
              </button>
              {showNotifications && <div className="absolute right-0 top-12 z-30 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="flex items-center justify-between px-3 py-2"><p className="text-xs font-black uppercase tracking-wider text-slate-500">Notifications</p><span className="text-[10px] font-bold text-slate-400">{notifications.filter((notification) => !notification.read).length} unread</span></div>
                {notifications.length === 0 ? <p className="px-3 py-5 text-center text-xs text-slate-400">No notifications yet.</p> : notifications.slice(0, 5).map((notification) => <button key={notification.id} onClick={() => { if (notification.requestId) setSelectedId(notification.requestId); void markNotificationAsRead(notification.id); setShowNotifications(false); }} className={`block w-full rounded-xl p-3 text-left hover:bg-red-50 ${notification.read ? 'opacity-60' : 'bg-red-50/50'}`}><p className="text-xs font-black text-slate-900">{notification.title}</p><p className="mt-1 text-[11px] leading-4 text-slate-600">{notification.message}</p></button>)}
              </div>}
            </div>
            {currentView === 'dashboard' && (
              <button onClick={() => setCurrentView('resources')} className="flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors"><Package className="h-4 w-4" /> Manage Resources</button>
            )}
            <div className="hidden text-right sm:block"><p className="text-sm font-bold text-slate-900">{ngo.orgName}</p><p className="text-xs text-emerald-700"><span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" /> Verified partner</p></div>
            <button onClick={() => void logout()} className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50"><LogOut className="h-4 w-4" /> Sign out</button>
          </div>
        </div>
      </header>

      {currentView === 'resources' ? (
        <ResourceManagement onBack={() => setCurrentView('dashboard')} />
      ) : (
      <main className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8">
       <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
  <div>
    <p className="text-xs font-bold uppercase tracking-[.16em] text-red-600">
      Live dispatch
    </p>

    <h1 className="mt-1 font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
      Nearby requests
    </h1>

    <p className="mt-2 text-sm text-slate-500">
      Triage active requests, accept a mission, then coordinate directly with the person asking for help.
    </p>
  </div>

  <div className="flex flex-wrap items-center gap-3">
    <button
      onClick={() => void handleSimulation()}
      disabled={simulating}
      className="flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {simulating ? (
        <>
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          SIMULATING...
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4" />
          SIMULATE NEXT 30 MINUTES
        </>
      )}
    </button>

    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
      Live request feed
    </div>
  </div>
</div>
{simulationError && (
  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
    Simulation error: {simulationError}
  </div>
)}

{simulationState && (
  <WhatIfAnalysis result={simulationState} />
)}
{false && simulationResult && (
  <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">
          What-if analysis
        </p>

        <h2 className="mt-1 font-display text-2xl font-black text-slate-950">
          Next {simulationResult.simulationDurationMinutes} Minutes
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Predicted emergency pressure if no additional response is deployed.
        </p>
      </div>

      <div
        className={`rounded-xl px-4 py-3 text-center ${
          simulationResult.risk.level === 'HIGH'
            ? 'bg-red-50 text-red-700'
            : simulationResult.risk.level === 'MEDIUM'
            ? 'bg-amber-50 text-amber-700'
            : 'bg-emerald-50 text-emerald-700'
        }`}
      >
        <p className="text-[10px] font-black uppercase tracking-widest">
          Risk Level
        </p>

        <p className="text-xl font-black">
          {simulationResult.risk.level}
        </p>

        <p className="text-xs font-bold">
          Score: {simulationResult.risk.score}/100
        </p>
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl bg-red-50 p-4">
        <p className="text-xs font-bold text-red-600">CRITICAL</p>

        <p className="mt-1 text-2xl font-black text-red-700">
          {simulationResult.current.critical}
          <span className="mx-2 text-slate-300">Ã¢â€ â€™</span>
          {simulationResult.predicted.critical}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Current Ã¢â€ â€™ predicted
        </p>
      </div>

      <div className="rounded-xl bg-amber-50 p-4">
        <p className="text-xs font-bold text-amber-600">HIGH</p>

        <p className="mt-1 text-2xl font-black text-amber-700">
          {simulationResult.current.high}
          <span className="mx-2 text-slate-300">Ã¢â€ â€™</span>
          {simulationResult.predicted.high}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Current Ã¢â€ â€™ predicted
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-bold text-slate-600">MEDIUM</p>

        <p className="mt-1 text-2xl font-black text-slate-700">
          {simulationResult.current.medium}
          <span className="mx-2 text-slate-300">Ã¢â€ â€™</span>
          {simulationResult.predicted.medium}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Current Ã¢â€ â€™ predicted
        </p>
      </div>
    </div>

    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-bold uppercase text-slate-400">
          Available Responders
        </p>

        <p className="mt-1 text-xl font-black">
          {simulationResult.responderAnalysis.availableResponders}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-bold uppercase text-slate-400">
          Unassigned Emergencies
        </p>

        <p className="mt-1 text-xl font-black">
          {simulationResult.current.unassignedEmergencies}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-bold uppercase text-slate-400">
          Resource Shortages
        </p>

        <p className="mt-1 text-xl font-black">
          {simulationResult.resourceShortages.length}
        </p>
      </div>
    </div>

    {simulationResult.responderAnalysis.responderShortage && (
      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="font-black text-red-800">
          Ã¢Å¡Â  Responder shortage predicted
        </p>

        <p className="mt-1 text-sm text-red-700">
          Current available responders may not be sufficient for the
          predicted critical emergencies.
        </p>
      </div>
    )}

    {simulationResult.resourceShortages.length > 0 && (
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="font-black text-amber-800">
          Ã¢Å¡Â  Resource shortage predicted
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {simulationResult.resourceShortages.map((resource) => (
            <span
              key={resource.type}
              className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-800"
            >
              {resource.type}: {resource.availableQuantity} available
            </span>
          ))}
        </div>
      </div>
    )}
  </section>
)}
        <div className="grid gap-6 xl:grid-cols-[minmax(320px,430px)_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-display text-lg font-black">Priority Queue</h2><span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">{activeRequests.filter((request) => request.status === 'active').length} active</span></div><div className="space-y-3">{activeRequests.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">No nearby requests right now.</div> : activeRequests.map((request) => <RequestRow key={request.id} request={request} selected={request.id === selectedId} onSelect={() => setSelectedId(request.id)} onAccept={() => void handleAccept(request)} onShowPriority={() => { setSelectedId(request.id); setShowPriorityModal(true); }} />)}</div></section>
          <section className="min-h-[620px] rounded-2xl border border-slate-200 bg-white shadow-sm">{selectedRequest ? <IncidentWorkspace request={selectedRequest} accepted={isAcceptedByThisNgo} currentUserId={ngo?.uid} messages={messages} messageText={messageText} setMessageText={setMessageText} onSend={handleSend} sending={sending} onAccept={() => void handleAccept(selectedRequest)} /> : <div className="flex h-full min-h-[620px] flex-col items-center justify-center p-8 text-center"><Navigation className="h-12 w-12 text-slate-300" /><h2 className="mt-4 font-display text-2xl font-black text-slate-900">Waiting for emergency requests</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">New user SOS requests will appear here automatically when the shared Firebase feed is connected.</p></div>}</section>
        </div>
      </main>
      )}
      
      {showPriorityModal && selectedRequest && (
        <PriorityBreakdownModal 
          request={selectedRequest} 
          onClose={() => setShowPriorityModal(false)} 
        />
      )}
    </div>
  );
};

const RequestRow: React.FC<{ request: EmergencyRequest; selected: boolean; onSelect: () => void; onAccept: () => void; onShowPriority: () => void }> = ({ request, selected, onSelect, onAccept, onShowPriority }) => (
  <button onClick={onSelect} className={`w-full rounded-xl border p-4 text-left transition ${selected ? 'border-red-300 bg-red-50/60' : 'border-slate-200 bg-white hover:border-red-200 hover:bg-slate-50'}`}>
    <div className="flex items-start justify-between gap-3"><div className="flex flex-wrap gap-1.5 flex-1">{request.needs.map((need) => <span key={need} className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700">{need}</span>)}</div><div className="flex items-center gap-2"><button onClick={(e) => { e.stopPropagation(); onShowPriority(); }} className="transition hover:scale-105 active:scale-95"><PriorityBadge level={request.priorityLevel} score={request.priorityScore} size="sm" /></button><span className="shrink-0 font-mono text-[10px] text-slate-400">{request.distanceKm} km</span></div></div>
    <p className="mt-3 line-clamp-2 text-sm font-semibold leading-5 text-slate-800">{request.description}</p><p className="mt-2 flex items-center gap-1.5 truncate text-xs text-slate-500"><MapPin className="h-3.5 w-3.5 shrink-0 text-red-600" /> {request.location.address || 'Location detected'}</p>
    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3"><span className="text-[11px] text-slate-400">{formatTime(request.createdAt)}</span>{request.status === 'active' ? <span role="button" onClick={(event) => { event.stopPropagation(); onAccept(); }} className="rounded-lg bg-red-600 px-3 py-2 text-[11px] font-bold text-white hover:bg-red-700">Accept request</span> : <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Accepted</span>}</div>
  </button>
);

const IncidentWorkspace: React.FC<{ request: EmergencyRequest; accepted: boolean; currentUserId?: string; messages: ChatMessage[]; messageText: string; setMessageText: (value: string) => void; onSend: (event: React.FormEvent) => void; sending: boolean; onAccept: () => void }> = ({ request, accepted, currentUserId, messages, messageText, setMessageText, onSend, sending, onAccept }) => (
  <div className="flex h-full min-h-[620px] flex-col"><div className="border-b border-slate-200 p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700">Incident {request.id}</span><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${accepted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{accepted ? 'Accepted' : 'Awaiting acceptance'}</span></div><h2 className="mt-3 font-display text-2xl font-black text-slate-950">{request.requesterName} needs help</h2><p className="mt-1 text-sm text-slate-500">Reported {formatTime(request.createdAt)} · {request.requesterPhone || 'Phone unavailable'}</p></div>{!accepted && <button onClick={onAccept} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-black text-white hover:bg-red-700"><ShieldCheck className="h-4 w-4" /> Accept and dispatch</button>}</div><div className="mt-5 flex flex-wrap gap-2">{request.needs.map((need) => <span key={need} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{need}</span>)}</div><p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{request.description}</p></div>{accepted ? <><div className="grid gap-4 border-b border-slate-200 p-5 sm:grid-cols-[1fr_250px] sm:p-6"><div><div className="mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-red-600" /><h3 className="font-display text-base font-black">User location</h3></div><SOSLocationMap location={request.location} priorityLevel={request.priorityLevel} /><p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><Navigation className="h-3.5 w-3.5 text-red-600" /> {request.location.address || 'Detected location'} · {request.location.latitude.toFixed(4)}, {request.location.longitude.toFixed(4)}</p></div><div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Contact requester</p><p className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-800"><Phone className="h-4 w-4 text-red-600" /> {request.requesterPhone || 'Phone unavailable'}</p><a href={request.requesterPhone ? `tel:${request.requesterPhone}` : undefined} className="mt-4 block rounded-lg bg-slate-900 px-3 py-2.5 text-center text-xs font-bold text-white">Call requester</a></div></div><div className="flex min-h-[235px] flex-1 flex-col p-5 sm:p-6"><div className="mb-3 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-red-600" /><h3 className="font-display text-base font-black">Direct coordination chat</h3><span className="ml-auto text-[11px] font-semibold text-emerald-700">Live</span></div><div className="flex-1 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3">{messages.length === 0 ? <p className="py-6 text-center text-xs text-slate-500">Send a message to ask what else the requester needs.</p> : messages.map((message) => <div key={message.id} className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${message.senderId !== currentUserId ? 'ml-auto bg-red-600 text-white' : 'bg-white text-slate-700 shadow-sm'}`}><p className="text-[10px] font-bold opacity-70">{message.senderName}</p><p className="mt-1">{message.text}</p></div>)}</div><form onSubmit={onSend} className="mt-3 flex gap-2"><input value={messageText} onChange={(event) => setMessageText(event.target.value)} placeholder="Ask about blood, medicine, or other support..." className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-red-500" /><button disabled={sending} aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"><Send className="h-4 w-4" /></button></form></div></> : <div className="flex flex-1 flex-col items-center justify-center p-8 text-center"><MapPin className="h-10 w-10 text-slate-300" /><h3 className="mt-4 font-display text-xl font-black">Accept to view exact location</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">The requester’s map and direct contact channel are shared with your NGO after acceptance.</p></div>}</div>
);

const AuthScreen: React.FC<{ mode: 'login' | 'register'; setMode: (mode: 'login' | 'register') => void; form: FormState; updateForm: <K extends keyof FormState>(key: K, value: FormState[K]) => void; loginEmail: string; loginPassword: string; setLoginEmail: (value: string) => void; setLoginPassword: (value: string) => void; error: string; onLogin: (event: React.FormEvent) => void; onRegister: (event: React.FormEvent) => void }> = ({ mode, setMode, form, updateForm, loginEmail, loginPassword, setLoginEmail, setLoginPassword, error, onLogin, onRegister }) => (
  <div className="min-h-screen bg-[#f6f7f9] px-4 py-10 text-slate-900 sm:px-8"><div className="mx-auto max-w-6xl"><div className="mb-10 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white"><AlertTriangle className="h-5 w-5" /></div><div><p className="font-display text-lg font-black tracking-wide">CRISIS<span className="text-red-600">CONNECT</span></p><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-400">Verified NGO portal</p></div></div><div className="grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr]"><div className="pt-5"><p className="text-xs font-bold uppercase tracking-[.16em] text-red-600">Partner access</p><h1 className="mt-3 max-w-lg font-display text-5xl font-black leading-none tracking-tight text-slate-950">Move help where it matters.</h1><p className="mt-5 max-w-md text-base leading-7 text-slate-600">Receive nearby emergency requests, accept the incidents your organization can handle, and coordinate directly with the requester.</p><div className="mt-8 space-y-4 text-sm font-semibold text-slate-700"><p className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Verified organization access</p><p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-red-600" /> Location shared after acceptance</p><p className="flex items-center gap-3"><MessageSquare className="h-5 w-5 text-red-600" /> Private incident chat</p></div></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,.08)] sm:p-8"><div className="mb-7 flex gap-1 rounded-xl bg-slate-100 p-1"><button onClick={() => setMode('login')} className={`flex-1 rounded-lg py-3 text-sm font-bold ${mode === 'login' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>Sign in</button><button onClick={() => setMode('register')} className={`flex-1 rounded-lg py-3 text-sm font-bold ${mode === 'register' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}>Register NGO</button></div>{error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}{mode === 'login' ? <form onSubmit={onLogin} className="space-y-4"><Field label="Official Email"><input required type="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} placeholder="contact@ngo.org" className="portal-input" /></Field><Field label="Password"><input required type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} placeholder="Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢" className="portal-input" /></Field><button className="portal-primary">Sign in to NGO portal</button></form> : <form onSubmit={onRegister} className="grid gap-4 sm:grid-cols-2"><Field label="Organization Name"><input required value={form.organizationName} onChange={(event) => updateForm('organizationName', event.target.value)} placeholder="Helping Hands Foundation" className="portal-input" /></Field><Field label="NGO Registration ID"><input required value={form.registrationId} onChange={(event) => updateForm('registrationId', event.target.value)} placeholder="NGO12345" className="portal-input" /></Field><Field label="Official Email"><input required type="email" value={form.email} onChange={(event) => updateForm('email', event.target.value)} placeholder="contact@ngo.org" className="portal-input" /></Field><Field label="Phone"><input required value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} placeholder="+91 XXXXX XXXXX" className="portal-input" /></Field><Field label="Password"><input required minLength={6} type="password" value={form.password} onChange={(event) => updateForm('password', event.target.value)} placeholder="Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢Ã¢â‚¬Â¢" className="portal-input" /></Field><Field label="Operating Area"><input required value={form.area} onChange={(event) => updateForm('area', event.target.value)} placeholder="Pune" className="portal-input" /></Field><Field label="Emergency Services" full><div className="flex flex-wrap gap-2">{needs.slice(0, 8).map((need) => <button type="button" key={need} onClick={() => updateForm('services', form.services.includes(need) ? form.services.filter((value) => value !== need) : [...form.services, need])} className={`rounded-lg border px-3 py-2 text-xs font-bold ${form.services.includes(need) ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200 text-slate-500'}`}>{need}</button>)}</div></Field><Field label="Organization Address" full><textarea required rows={3} value={form.address} onChange={(event) => updateForm('address', event.target.value)} placeholder="Organization address..." className="portal-input resize-none" /></Field><button className="portal-primary sm:col-span-2">Create NGO account</button></form>}</div></div></div></div>
);

const Field: React.FC<{ label: string; full?: boolean; children: React.ReactNode }> = ({ label, full, children }) => <label className={full ? 'sm:col-span-2' : ''}><span className="mb-1.5 block text-xs font-bold text-slate-700">{label}</span>{children}</label>;
