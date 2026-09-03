import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const NGOActiveAssistancePage: React.FC = () => {
  const { requests, resolveRequest } = useEmergency();
  const { currentUser } = useAuth();

  // Requests accepted by this NGO or in active deployment
  const activeMissions = requests.filter(r => 
    (r.acceptedByType === 'ngo' || r.acceptedBy === currentUser?.uid) && r.status !== 'resolved'
  );

  return (
    <div className="min-h-screen bg-[#070B14] py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Active Deployments
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
            Active Assistance Missions ({activeMissions.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Incidents committed to by your organization currently in progress
          </p>
        </div>

        {activeMissions.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 max-w-md mx-auto">
            <Activity className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="font-bold text-base text-white">No active missions right now</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Review incoming emergency queue or live map to dispatch units.
            </p>
            <Link
              to="/ngo/requests"
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider"
            >
              Browse Emergency Queue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMissions.map((m) => (
              <div
                key={m.id}
                className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-emerald-500/[0.02] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-wrap gap-1">
                      {m.needs.map(n => (
                        <span
                          key={n}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                    <StatusBadge status={m.status} size="sm" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {m.needs.join(' + ')} Deployment
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>

                  <div className="pt-3 mt-3 border-t border-white/10 text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span className="truncate">{m.location.address || 'Detected Location'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Requester: {m.requesterName}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${m.requesterPhone || '+15550000000'}`}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-400 text-xs font-bold"
                      title="Call requester"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <Link
                      to={`/ngo/requests/${m.id}`}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                      <span>Chat & Dossier</span>
                    </Link>
                  </div>

                  <button
                    onClick={() => resolveRequest(m.id)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
