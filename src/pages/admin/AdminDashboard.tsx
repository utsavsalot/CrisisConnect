import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  Building2, 
  ShieldAlert, 
  Clock, 
  CheckCircle,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const AdminDashboard: React.FC = () => {
  const { requests, acceptRequest } = useEmergency();

  const activeRequests = requests.filter(r => r.status === 'active');
  const acceptedRequests = requests.filter(r => r.status === 'accepted' || r.status === 'in_progress');
  const resolvedRequests = requests.filter(r => r.status === 'resolved');

  // Any request active for > 15 minutes is flagged as needing emergency attention
  const needsAttention = activeRequests.filter(r => {
    const diff = Date.now() - new Date(r.createdAt).getTime();
    return diff > 1000 * 60 * 10; // > 10 minutes
  });

  return (
    <div className="min-h-screen bg-theme-light py-8 px-4 sm:px-6 lg:px-8 text-theme-dark">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="border-b border-theme-mint/30 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Community Dispatch Safety Net
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-theme-dark font-display mt-1">
            ADMIN EMERGENCY DISPATCH
          </h1>
          <p className="text-xs text-theme-forest/80 mt-0.5">
            Supervisory fallback to escalate unaccepted requests and ensure zero dropped calls
          </p>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-emergency-500/30">
            <span className="text-xs font-mono font-bold uppercase text-theme-forest/80">Unaccepted Emergencies</span>
            <div className="text-3xl font-black text-emergency-400 font-display mt-2">{activeRequests.length}</div>
            <span className="text-[11px] text-theme-forest/80">Awaiting responder commitment</span>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-amber-500/30">
            <span className="text-xs font-mono font-bold uppercase text-theme-forest/80">Needs Admin Attention</span>
            <div className="text-3xl font-black text-amber-400 font-display mt-2">{needsAttention.length}</div>
            <span className="text-[11px] text-theme-forest/80">Exceeded 10-minute threshold</span>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30">
            <span className="text-xs font-mono font-bold uppercase text-theme-forest/80">Active Field Missions</span>
            <div className="text-3xl font-black text-emerald-400 font-display mt-2">{acceptedRequests.length}</div>
            <span className="text-[11px] text-theme-forest/80">Coordinated by Responders / NGOs</span>
          </div>
        </div>

        {/* Priority Escalation Section */}
        <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 bg-amber-500/[0.02] space-y-4">
          <div className="flex items-center gap-2 border-b border-theme-mint/30 pb-3">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-theme-dark uppercase tracking-wider font-display">
              ⚠️ Needs Admin Attention ({needsAttention.length})
            </h2>
          </div>

          {needsAttention.length === 0 ? (
            <p className="text-xs text-theme-forest/80 py-4 text-center">
              All active requests have been dispatched within standard response intervals.
            </p>
          ) : (
            <div className="space-y-3">
              {needsAttention.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-white/5 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-emergency-400">
                        {req.needs.join(', ')}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                        UNACCEPTED &gt; 10 MIN
                      </span>
                    </div>
                    <p className="text-xs text-theme-dark/90">{req.description}</p>
                    <span className="text-[11px] text-theme-forest/80 font-mono mt-1 block">
                      Location: {req.location.address || 'Detected Location'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => acceptRequest(req.id)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-theme-dark font-bold text-xs uppercase tracking-wider"
                    >
                      Handle Request
                    </button>
                    <Link
                      to={`/requests/${req.id}`}
                      className="px-3 py-2 rounded-xl bg-white/10 text-theme-dark/90 text-xs font-semibold"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Incident Overview */}
        <div className="glass-panel rounded-3xl p-6 border border-theme-mint/30 space-y-4">
          <div className="flex items-center justify-between border-b border-theme-mint/30 pb-3">
            <h3 className="text-sm font-bold text-theme-dark uppercase tracking-wider">
              All Real-Time Incidents ({requests.length})
            </h3>
            <Link to="/ngo/map" className="text-xs text-sky-400 hover:underline">
              View on Live Leaflet Map
            </Link>
          </div>

          <div className="space-y-2.5">
            {requests.slice(0, 8).map(r => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl bg-white/5 border border-theme-mint/20 flex items-center justify-between gap-4 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-theme-dark">{r.needs.join(', ')}</span>
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                  <p className="text-theme-forest/80 truncate max-w-lg mt-0.5">{r.description}</p>
                </div>
                <Link
                  to={`/requests/${r.id}`}
                  className="text-sky-400 hover:underline font-semibold shrink-0"
                >
                  View Dossier →
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
