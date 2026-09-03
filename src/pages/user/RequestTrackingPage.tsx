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
  Building2
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { RequestTimeline } from '../../components/emergency/RequestTimeline';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ChatMessage } from '../../types';

export const RequestTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequestById, updateStatus, resolveRequest } = useEmergency();
  const { getMessages, sendMessage, subscribeToChat } = useChat();
  const { currentUser } = useAuth();

  const request = getRequestById(id || '');

  const [messages, setMessages] = useState<ChatMessage[]>(() => (id ? getMessages(id) : []));
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const isAccepted = request.status === 'accepted' || request.status === 'in_progress' || request.status === 'resolved';

  return (
    <div className="min-h-screen bg-theme-light py-8 px-4 sm:px-6 lg:px-8 text-theme-dark">
      <div className="max-w-5xl mx-auto space-y-6">
        
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

          {request.status !== 'resolved' && (
            <button
              onClick={handleMarkResolved}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-theme-dark font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Resolved</span>
            </button>
          )}
        </div>

        {/* 5-Step Visual Timeline Component */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-theme-mint/30 shadow-xl">
          <RequestTimeline status={request.status} />
        </div>

        {/* Status Callout Banner */}
        {request.status === 'active' && (
          <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-start gap-4">
            <Radio className="w-6 h-6 text-sky-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h4 className="text-sm font-bold text-theme-dark uppercase tracking-wider font-display">
                NO RESPONDER HAS ACCEPTED YET
              </h4>
              <p className="text-xs text-sky-300 mt-1 leading-relaxed">
                Your emergency request is active across the local mesh. We are continuing to broadcast your GPS coordinates to available medical responders, rescue volunteers, and nearby relief organizations.
              </p>
            </div>
          </div>
        )}

        {request.status === 'accepted' && (
          <div className="p-5 rounded-2xl bg-sky-500/15 border border-sky-500/40 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-theme-dark uppercase tracking-wider font-display">
                ASSISTANCE ACCEPTED
              </h4>
              <p className="text-xs text-sky-300 mt-1 leading-relaxed">
                <strong>{request.acceptedByName || 'Emergency Responder'}</strong> has accepted this request. Coordinate details via the chat below.
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
            <div className="glass-panel rounded-3xl p-6 border border-theme-mint/30 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-theme-forest/80">
                Incident Dossier
              </h3>

              <div className="flex flex-wrap gap-1.5">
                {request.needs.map(n => (
                  <span
                    key={n}
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emergency-500/20 text-emergency-300 border border-emergency-500/30"
                  >
                    {n}
                  </span>
                ))}
              </div>

              <p className="text-xs sm:text-sm text-theme-dark/90 leading-relaxed font-medium">
                {request.description}
              </p>

              <div className="pt-4 border-t border-theme-mint/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-theme-forest/80">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-theme-dark truncate">{request.location.address || 'Detected Location'}</span>
                </div>
                <div className="text-[10px] text-theme-forest/60 font-mono pl-6">
                  {request.location.latitude.toFixed(4)}° N, {request.location.longitude.toFixed(4)}° W
                </div>
              </div>
            </div>

            {/* Assigned Responder / NGO Card */}
            {isAccepted ? (
              <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-emerald-500/[0.03] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Assigned Unit
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {request.acceptedByType === 'ngo' ? 'NGO Operation' : 'Community Responder'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
                    {request.acceptedByType === 'ngo' ? <Building2 className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-theme-dark font-display">
                      {request.acceptedByName || 'Emergency Responder'}
                    </h4>
                    <p className="text-xs text-theme-forest/80">
                      Approx. distance: <span className="text-emerald-400 font-semibold font-mono">{request.distanceKm || 1.4} km away</span>
                    </p>
                  </div>
                </div>

                {/* Direct Action Buttons: Call & In-Progress Advance */}
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href="tel:+15559110000"
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-theme-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-theme-mint/30"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Call Unit</span>
                  </a>

                  {request.status === 'accepted' && (
                    <button
                      onClick={handleAdvanceStatus}
                      className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-theme-dark font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Start Assistance
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-panel rounded-3xl p-6 border border-theme-mint/30 text-center text-theme-forest/60 text-xs py-8">
                <Radio className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-pulse" />
                <span>Awaiting responder commitment...</span>
              </div>
            )}

          </div>

          {/* Right Column: Real-Time Coordination Chat (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl border border-theme-mint/30 flex flex-col h-[520px] overflow-hidden shadow-2xl">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-theme-mint/30 bg-white/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-theme-dark">
                  Live Dispatch Coordination Chat
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                MESH ACTIVE
              </span>
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar">
              {messages.length === 0 ? (
                <div className="text-center py-16 text-theme-forest/60 text-xs">
                  {isAccepted 
                    ? 'Coordination channel established. Send a message to coordinate arrival.'
                    : 'Chat will activate once a responder or NGO accepts your emergency request.'}
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = currentUser ? msg.senderId === currentUser.uid : false;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-theme-forest/80 mb-1 px-1">
                        {msg.senderName} • {msg.senderRole}
                      </span>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          isMine
                            ? 'bg-sky-600 text-theme-dark rounded-br-none shadow-md'
                            : 'bg-white/10 text-theme-dark rounded-bl-none border border-theme-mint/30'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-theme-forest/60 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-theme-mint/30 bg-white/80">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isAccepted ? "Type a coordination message or arrival detail..." : "Awaiting responder acceptance to chat..."}
                  disabled={!isAccepted}
                  className="flex-1 bg-theme-sage/80 border border-theme-mint/30 rounded-xl px-4 py-2.5 text-xs text-theme-dark placeholder:text-theme-forest/60 focus:outline-none focus:border-sky-400 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || !isAccepted}
                  className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-theme-dark transition-all"
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
