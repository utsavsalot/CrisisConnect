import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Activity, 
  Radio, 
  ShieldCheck,
  AlertTriangle, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const NGODashboard: React.FC = () => {
  const { requests, acceptRequest } = useEmergency();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const orgName = currentUser && 'orgName' in currentUser ? currentUser.orgName : 'Metro Relief & Red Cross';

  const activeEmergencies = requests.filter(r => r.status === 'active');
  const acceptedMissions = requests.filter(r => r.acceptedByType === 'ngo' || r.acceptedBy === currentUser?.uid);
  const resolvedCount = requests.filter(r => r.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-theme-light py-8 px-4 sm:px-6 lg:px-8 text-theme-dark">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HQ Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-mint/30 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                Operations Command Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-theme-dark font-display mt-1">
              {orgName}
            </h1>
            <p className="text-xs text-theme-forest/80 mt-0.5">
              Live district telemetry, resource allocation, and multi-incident dispatch
            </p>
          </div>

        </div>

        {/* 4 Operations KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-emergency-500/30 bg-emergency-500/[0.04]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emergency-400">Active Queue</span>
              <AlertTriangle className="w-5 h-5 text-emergency-500" />
            </div>
            <div className="text-3xl font-black text-theme-dark font-display mt-3">
              {activeEmergencies.length}
            </div>
            <p className="text-[11px] text-theme-forest/80 mt-1">Requiring immediate response</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-sky-500/30 bg-sky-500/[0.04]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-sky-400">Deployed Units</span>
              <Activity className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-3xl font-black text-theme-dark font-display mt-3">
              {acceptedMissions.length}
            </div>
            <p className="text-[11px] text-theme-forest/80 mt-1">Active field operations</p>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 bg-emerald-500/[0.04]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-400">Resolved Today</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-theme-dark font-display mt-3">
              {resolvedCount}
            </div>
            <p className="text-[11px] text-theme-forest/80 mt-1">Successful resolutions</p>
          </div>

        </div>

        {/* Operational Map & Incoming Incident Queue Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Incoming Emergency Requests (2 cols) */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-theme-mint/30 space-y-4">
            <div className="flex items-center justify-between border-b border-theme-mint/30 pb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emergency-500 animate-pulse" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-theme-dark">
                  Live Emergency Queue ({activeEmergencies.length})
                </h3>
              </div>
              <Link to="/ngo/requests" className="text-xs text-sky-400 hover:underline">
                View All In Queue
              </Link>
            </div>

            <div className="space-y-3">
              {activeEmergencies.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-theme-mint/20 hover:border-emergency-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-theme-dark">
                        {req.needs.join(', ')}
                      </span>
                      <StatusBadge status={req.status} size="sm" />
                      <span className="text-[10px] text-theme-forest/80 font-mono">
                        {req.distanceKm || 1.4} km away
                      </span>
                    </div>
                    <p className="text-xs text-theme-forest line-clamp-2">
                      {req.description}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-theme-forest/80 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      <span className="truncate">{req.location.address || 'Detected Location'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <Link
                      to={`/ngo/requests/${req.id}`}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-theme-dark text-xs font-semibold"
                    >
                      Dossier
                    </Link>
                    <button
                      onClick={async () => {
                        await acceptRequest(req.id);
                        navigate(`/ngo/requests/${req.id}`);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-theme-dark font-bold text-xs uppercase tracking-wider shadow-sm"
                    >
                      Accept & Handle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
