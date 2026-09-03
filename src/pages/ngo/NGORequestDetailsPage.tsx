import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ChatMessage } from '../../types';

export const NGORequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequestById, acceptRequest, updateStatus, resolveRequest } = useEmergency();
  const { getMessages, sendMessage, subscribeToChat } = useChat();
  const { currentUser } = useAuth();

  const request = getRequestById(id || '');
  const [messages, setMessages] = useState<ChatMessage[]>(() => (id ? getMessages(id) : []));
  const [inputText, setInputText] = useState('');

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

  if (!request) {
    return (
      <div className="min-h-screen bg-theme-light py-16 px-4 text-center text-theme-dark">
        <p>Incident not found.</p>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !id) return;
    await sendMessage(id, inputText.trim());
    setInputText('');
  };

  const handleAccept = async () => {
    await acceptRequest(request.id);
  };

  const handleMarkResolved = async () => {
    if (window.confirm('Mark this incident assistance as fully completed?')) {
      await resolveRequest(request.id);
    }
  };

  return (
    <div className="min-h-screen bg-theme-light py-8 px-4 sm:px-6 lg:px-8 text-theme-dark">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-mint/30 pb-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-theme-forest/80 hover:text-theme-dark transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Queue</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-theme-dark font-display">
                INCIDENT DOSSIER #{request.id}
              </h1>
              <StatusBadge status={request.status} size="md" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {request.status === 'active' && (
              <button
                onClick={handleAccept}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-theme-dark font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Accept & Deploy Unit</span>
              </button>
            )}

            {request.status !== 'resolved' && request.status !== 'active' && (
              <button
                onClick={handleMarkResolved}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-theme-dark font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Assistance Complete</span>
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Incident Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-3xl p-6 border border-theme-mint/30 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-theme-forest/80">
                Incident Triage Details
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

              <p className="text-sm text-theme-dark leading-relaxed font-medium">
                {request.description}
              </p>

              <div className="pt-4 border-t border-theme-mint/30 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-theme-forest/80">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <span className="text-theme-dark/90">{request.location.address || 'Detected Location'}</span>
                </div>
                <div className="flex items-center gap-2 text-theme-forest/80">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-theme-dark/90">Requester: {request.requesterName}</span>
                </div>
              </div>

              {/* Call Requester CTA */}
              <div className="pt-2">
                <a
                  href={`tel:${request.requesterPhone || '+15550009999'}`}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-theme-dark font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-theme-mint/30"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Requester Directly</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Coordination Chat (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl border border-theme-mint/30 flex flex-col h-[520px] overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-theme-mint/30 bg-white/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-theme-dark">
                  Field Coordination Channel
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">SECURE DISPATCH</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar">
              {messages.length === 0 ? (
                <div className="text-center py-20 text-xs text-theme-forest/60">
                  No coordination messages yet. Send a message to contact the requester.
                </div>
              ) : (
                messages.map(m => {
                  const isMine = currentUser ? m.senderId === currentUser.uid : false;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-theme-forest/80 mb-0.5 px-1">
                        {m.senderName} ({m.senderRole})
                      </span>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                          isMine
                            ? 'bg-sky-600 text-theme-dark rounded-br-none'
                            : 'bg-white/10 text-theme-dark rounded-bl-none border border-theme-mint/30'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-theme-forest/60 mt-1 px-1">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 border-t border-theme-mint/30 bg-white/80">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Send arrival update or instructions to requester..."
                  className="flex-1 bg-theme-sage/80 border border-theme-mint/30 rounded-xl px-4 py-2.5 text-xs text-theme-dark placeholder:text-theme-forest/60 focus:outline-none focus:border-sky-400"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
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
