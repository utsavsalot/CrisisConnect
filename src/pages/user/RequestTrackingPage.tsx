import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  UserCheck,
  Radio,
  Building2,
  Navigation,
  User,
  ExternalLink
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { RequestTimeline } from '../../components/emergency/RequestTimeline';
import { SOSLocationMap } from '../../components/emergency/SOSLocationMap';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ChatMessage } from '../../types';
import { getEscalationStep, getRequiredEscalation, getSecondsUntilNextEscalation } from '../../services/escalation';

export const RequestTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequestById, acceptRequest, updateStatus, resolveRequest } = useEmergency();
  const { getMessages, sendMessage, subscribeToChat } = useChat();
  const { currentUser } = useAuth();

  const request = getRequestById(id || '');

  const [messages, setMessages] = useState<ChatMessage[]>(() => (id ? getMessages(id) : []));
  const [inputText, setInputText] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (request?.status !== 'active') return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [request?.status]);

  useEffect(() => {
    if (!id) return;
    setMessages(getMessages(id));
    const unsub = subscribeToChat(id, (msgs) => {
      setMessages(msgs);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [id, subscribeToChat, getMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!request) {
    return (
      <div className="min-h-screen bg-theme-light py-16 px-4 text-center text-theme-dark">
        <div className="max-w-md mx-auto glass-panel p-8 rounded-3xl border border-theme-mint/30">
          <AlertTriangle className="w-12 h-12 text-emergency-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-display">Emergency Request Not Found</h2>
          <p className="text-xs text-theme-forest/80 mt-2">
            The requested incident dossier could not be located or has been archived.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-theme-dark rounded-xl text-xs font-bold"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !id) return;
    const sent = await sendMessage(id, inputText.trim());
    setMessages((current) => current.some((message) => message.id === sent.id) ? current : [...current, sent]);
    setInputText('');
  };

  const handleMarkResolved = async () => {
    if (window.confirm('Are you sure you want to mark this emergency as resolved?')) {
      await resolveRequest(request.id);
    }
  };

  const handleAdvanceStatus = async () => {
    if (request.status === 'accepted') {
      await updateStatus(request.id, 'in_progress');
    }
  };

  const handleAcceptRequest = async () => {
    if (!id) return;
    await acceptRequest(id);
  };

  const isRequester = currentUser?.uid === request.requesterId;
  const canHelperAccept = !isRequester && request.status === 'active';
  const isAccepted = request.status === 'accepted' || request.status === 'in_progress' || request.status === 'resolved';
  const responderLabel = request.acceptedByType === 'ngo' ? 'NGO Operation' : 'Community Helper';
  const responderDisplayName = request.acceptedByName || request.communityHelperName || request.ngoResponderName || 'Emergency Responder';
  const displayedEscalation = getRequiredEscalation(request, now);
  const displayedRadius = Math.max(request.escalationRadiusKm || 5, displayedEscalation.radiusKm);
  const displayedRequest = displayedEscalation.level === request.escalationLevel
    ? request
    : { ...request, escalationLevel: displayedEscalation.level, escalationRadiusKm: displayedRadius };
  const secondsUntilEscalation = getSecondsUntilNextEscalation(displayedRequest, now);
  const countdown = secondsUntilEscalation === null
    ? null
    : `${Math.floor(secondsUntilEscalation / 60).toString().padStart(2, '0')}:${(secondsUntilEscalation % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-theme-light py-8 px-4 sm:px-6 lg:px-8 text-theme-dark">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-mint/30 pb-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-theme-forest/80 hover:text-theme-dark transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Requests</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-theme-dark font-display">
                REQUEST TRACKING
              </h1>
              <StatusBadge status={request.status} size="md" />
            </div>
            <p className="text-xs text-theme-forest/80 mt-0.5 font-mono">
              INCIDENT REF: #{request.id} • REPORTED {new Date(request.createdAt).toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canHelperAccept && (
              <button
                onClick={handleAcceptRequest}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>I Can Help</span>
              </button>
            )}

            {request.status === 'in_progress' && (
              <button
                onClick={handleMarkResolved}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-theme-dark font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Assistance Complete</span>
              </button>
            )}
          </div>
        </div>

        {/* 5-Step Visual Timeline Component */}
        <div className="rounded-3xl border border-slate-200 bg-[#fffefa] p-6 shadow-[0_14px_40px_rgba(15,23,42,0.10)] sm:p-8">
          <RequestTimeline status={request.status} />
        </div>

        {/* Status Callout Banner */}
        {request.status === 'active' && (
          <div className="p-5 rounded-2xl bg-sky-100 border border-sky-300 flex items-start gap-4">
            <Radio className="w-6 h-6 text-sky-700 shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-black uppercase tracking-wider font-display">
                NO RESPONDER HAS ACCEPTED YET
              </h4>
              <p className="text-xs text-black mt-1 leading-relaxed">
                Searching for available responders within <strong>{displayedRadius} km</strong>. The search expands automatically if nobody accepts.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono font-bold uppercase tracking-wide">
                <span className="rounded-lg border border-sky-400 bg-sky-200 px-2.5 py-1 text-black">Radius: {displayedRadius} km</span>
                {countdown && <span className="rounded-lg border border-sky-400 bg-sky-200 px-2.5 py-1 text-black">Next expansion: {countdown}</span>}
              </div>
            </div>
            {canHelperAccept && (
              <button
                onClick={handleAcceptRequest}
                className="shrink-0 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>I Can Help</span>
              </button>
            )}
          </div>
        )}

        {request.status === 'admin_escalated' && (
          <div className="p-5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-theme-dark uppercase tracking-wider font-display">ESCALATED TO CRISIS TEAM</h4>
              <p className="text-xs text-amber-300 mt-1 leading-relaxed">We could not find an available responder nearby. Your request has been escalated to the CrisisConnect emergency team.</p>
            </div>
          </div>
        )}

        {request.status === 'accepted' && (
          <div className="p-5 rounded-2xl bg-sky-500/15 border border-sky-500/40 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-theme-dark uppercase tracking-wider font-display">
                ASSISTANCE ACCEPTED ({responderLabel.toUpperCase()})
              </h4>
              <p className="text-xs text-sky-300 mt-1 leading-relaxed">
                <strong>{responderDisplayName}</strong> ({responderLabel}) has accepted this request. Coordinate details via the chat below.
              </p>
            </div>
          </div>
        )}

        {request.status === 'in_progress' && (
          <div className="p-5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-start gap-4">
            <UserCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h4 className="text-sm font-bold text-theme-dark uppercase tracking-wider font-display">
                ASSISTANCE IN PROGRESS
              </h4>
              <p className="text-xs text-amber-300 mt-1 leading-relaxed">
                Assistance is currently being rendered at the emergency location. Once complete, confirm below.
              </p>
            </div>
          </div>
        )}

        {request.status === 'resolved' && (
          <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-theme-dark uppercase tracking-wider font-display">
                ✓ EMERGENCY RESOLVED
              </h4>
              <p className="text-xs text-emerald-300 mt-1 leading-relaxed">
                This emergency request has been successfully resolved and verified. All units have completed assistance.
              </p>
            </div>
          </div>
        )}

        {/* Main Content Grid: Request Dossier & Real-time Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Incident Dossier & Responder Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Request Summary Card */}
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-[#fffefa] p-6 shadow-[0_14px_40px_rgba(15,23,42,0.10)]">
              <div className="flex items-center justify-between border-b border-red-100 pb-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-red-700">
                  Incident Dossier
                </h3>
                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {request.needs.map(n => (
                  <span
                    key={n}
                    className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700"
                  >
                    {n}
                  </span>
                ))}
              </div>

              <p className="text-xs font-medium leading-relaxed text-black sm:text-sm">
                {request.description}
              </p>

              {/* Requester / Person in Need Details */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-red-600 shrink-0" />
                    <div>
                      <span className="font-bold text-black block">{request.requesterName}</span>
                      <span className="text-[10px] text-slate-500">Person Requesting Help</span>
                    </div>
                  </div>
                  {request.requesterPhone && (
                    <a
                      href={`tel:${request.requesterPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-xs hover:bg-red-100 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Live Incident Location & Map */}
              <div className="space-y-2 border-t border-red-100 pt-3 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 text-red-700">
                    <MapPin className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                    <div>
                      <span className="font-bold text-black block">{request.location.address || 'Detected GPS Location'}</span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {request.location.latitude.toFixed(4)}° N, {request.location.longitude.toFixed(4)}° W
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${request.location.latitude},${request.location.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:underline shrink-0"
                  >
                    <span>Directions</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Leaflet Map Preview */}
                <div className="pt-2">
                  <SOSLocationMap location={request.location} />
                </div>
              </div>
            </div>

            {/* Assigned Responder / NGO Card */}
            {isAccepted ? (
              <div className="space-y-4 rounded-3xl border border-slate-200 bg-[#fffefa] p-6 shadow-[0_14px_40px_rgba(15,23,42,0.10)]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-700">
                    Assigned Unit
                  </span>
                  <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                    {responderLabel}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-lg font-bold text-red-600">
                    {request.acceptedByType === 'ngo' ? <Building2 className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-black">
                      {responderDisplayName}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Approx. distance: <span className="font-mono font-semibold text-red-700">{request.distanceKm || 1.4} km away</span>
                    </p>
                  </div>
                </div>

                {/* Direct Action Buttons: Call & In-Progress Advance */}
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href="tel:+15559110000"
                    className="flex-1 rounded-xl border border-red-200 bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-red-50 text-center flex items-center justify-center gap-1.5"
                  >
                    <Phone className="h-4 w-4 text-red-600" />
                    <span>Call Unit</span>
                  </a>

                  {request.status === 'accepted' && (
                    <button
                      onClick={handleAdvanceStatus}
                      className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
                    >
                      Start Assistance
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-[#fffefa] px-6 py-8 text-center text-xs text-slate-600 shadow-[0_14px_40px_rgba(15,23,42,0.10)] space-y-3">
                <Radio className="mx-auto mb-2 h-8 w-8 animate-pulse text-red-600" />
                <p>Awaiting responder commitment...</p>
                {canHelperAccept && (
                  <button
                    onClick={handleAcceptRequest}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-transform hover:bg-red-700 active:scale-95"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>I Can Help</span>
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Real-Time Coordination Chat (7 cols) */}
          <div className="flex h-[520px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-[#fffefa] shadow-[0_14px_40px_rgba(15,23,42,0.10)] lg:col-span-7">
            
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-red-100 bg-white p-4">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="h-4 w-4 text-red-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Live Dispatch Coordination Chat
                </span>
              </div>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-red-600">
                <span className="h-2 w-2 animate-ping rounded-full bg-red-600" />
                MESH ACTIVE
              </span>
            </div>

            {/* Message Feed */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-[#fffefa] p-4 no-scrollbar">
              {messages.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-600">
                  {isAccepted 
                    ? 'Coordination channel established. Send a message to coordinate arrival.'
                    : 'Chat will activate once a responder or NGO accepts your emergency request.'}
                </div>
              ) : (
                messages.map((msg) => {
                  const alignRight = msg.senderId !== currentUser?.uid;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${alignRight ? 'items-end' : 'items-start'}`}
                    >
                      <span className="mb-1 px-1 text-[10px] text-red-700">
                        {msg.senderName} • {msg.senderRole}
                      </span>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          alignRight
                            ? 'rounded-br-none bg-red-600 text-white shadow-md'
                            : 'rounded-bl-none border border-red-100 bg-white text-black shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="mt-1 px-1 text-[9px] text-slate-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t border-red-100 bg-white p-3">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isAccepted ? "Type a coordination message or arrival detail..." : "Awaiting responder acceptance to chat..."}
                  disabled={!isAccepted}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-black placeholder:text-slate-500 focus:border-red-500 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || !isAccepted}
                  className="rounded-xl bg-red-600 p-2.5 text-white transition-all hover:bg-red-700 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
