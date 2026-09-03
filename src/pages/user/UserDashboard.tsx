import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Activity, 
  CheckCircle, 
  Bell, 
  Users, 
  ChevronRight,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { GlassCard } from '../../components/ui/GlassCard';

export const UserDashboard: React.FC = () => {
  const { currentUser, isResponder, isAvailable, toggleResponderMode, setAvailability } = useAuth();
  const { myRequests, nearbyRequests, activeCount } = useEmergency();
  const navigate = useNavigate();

  const userName = currentUser && 'name' in currentUser ? currentUser.name : 'Citizen';

  // Find active request if any
  const activeRequest = myRequests.find(r => r.status === 'active' || r.status === 'accepted' || r.status === 'in_progress');

  return (
    <div className="min-h-screen bg-[#070B14] py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Greeting Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Citizen Incident Center
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
              Good day, {userName}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Community status: <span className="text-emerald-400 font-semibold">{activeCount} active emergencies</span> in your region.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/request-help')}
              className="emergency-cta px-5 py-2.5 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white font-bold text-xs uppercase tracking-wider shadow-emergency-glow beacon-pulse flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Request Help</span>
            </button>
          </div>
        </div>

        {/* Top 2 Primary Cards: Need Help Banner & Responder Mode Toggle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Main Emergency CTA Card */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emergency-900/40 via-slate-900/80 to-slate-950 border border-emergency-500/30 shadow-emergency-glow/20 flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-48 h-48 text-emergency-500" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emergency-500/20 text-emergency-400 text-[10px] font-bold tracking-wider uppercase border border-emergency-500/30 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emergency-500 animate-ping" />
                <span>Zero-Friction Emergency</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                Need Immediate Help?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md leading-relaxed">
                Broadcast an emergency request in under 15 seconds. Nearby verified community responders and NGOs will receive your GPS coordinates.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/request-help"
                className="px-6 py-3.5 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform active:scale-95"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Request Help Now</span>
              </Link>
              <span className="text-[11px] text-slate-400 font-mono">
                No lengthy forms • Automatic GPS
              </span>
            </div>
          </div>

          {/* Responder Mode Card */}
          <div className={`rounded-3xl p-6 sm:p-8 border transition-all flex flex-col justify-between ${
            isResponder && isAvailable
              ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg'
              : 'bg-slate-900/60 border-white/10'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className={`w-5 h-5 ${isResponder && isAvailable ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                    RESPONDER MODE
                  </span>
                </div>
                
                {/* On/Off Switch */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isResponder && isAvailable ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isResponder && isAvailable ? 'AVAILABLE' : 'OFF'}
                  </span>
                  <button
                    onClick={() => {
                      if (!isResponder) {
                        toggleResponderMode(true);
                      } else {
                        setAvailability(!isAvailable);
                      }
                    }}
                    className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                      isResponder && isAvailable ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                {isResponder && isAvailable
                  ? "You're Available to Help"
                  : 'Turn on Responder Mode'}
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {isResponder && isAvailable
                  ? 'Your status is active. Nearby emergency requests matching your capabilities will be delivered to your feed.'
                  : 'Receive nearby assistance requests when someone in your radius needs medical aid, shelter, food, or rare blood.'}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
              <Link
                to="/responder"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
              >
                <span>Manage Capabilities & Nearby Feed ({nearbyRequests.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Active Emergency Tracker if current user has an ongoing request */}
        {activeRequest && (
          <div className="rounded-2xl glass-panel p-6 border border-emergency-500/40 bg-emergency-500/[0.04]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emergency-600/20 border border-emergency-500 flex items-center justify-center text-emergency-500">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Your Active Emergency
                    </span>
                    <StatusBadge status={activeRequest.status} size="sm" />
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {activeRequest.needs.join(', ')}
                  </h3>
                </div>
              </div>

              <Link
                to={`/requests/${activeRequest.id}`}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Live Tracking & Chat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs text-slate-300 mb-3">{activeRequest.description}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{activeRequest.location.address || 'Detected Location'}</span>
            </div>
          </div>
        )}

        {/* Dashboard Grid: Recent Requests & Nearby Incidents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* My Recent Requests (2 cols) */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                  My Emergency Requests
                </h3>
              </div>
              <Link to="/requests" className="text-xs text-sky-400 hover:underline">
                View All
              </Link>
            </div>

            {myRequests.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">
                No emergency requests yet. You're all clear.
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.slice(0, 3).map((req) => (
                  <Link
                    key={req.id}
                    to={`/requests/${req.id}`}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-4 block"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-white">
                          {req.needs.join(', ')}
                        </span>
                        <StatusBadge status={req.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-md">
                        {req.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Capabilities Sidebar */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Quick Actions
              </h3>
            </div>

            <div className="space-y-2.5">
              <Link
                to="/request-help"
                className="w-full p-3 rounded-xl bg-emergency-600/20 hover:bg-emergency-600/30 border border-emergency-500/30 text-white font-bold text-xs flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-emergency-500" />
                  <span>Request Emergency Aid</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emergency-400" />
              </Link>

              <Link
                to="/responder"
                className="w-full p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-white font-bold text-xs flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Responder Feed</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </Link>

              <Link
                to="/notifications"
                className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sky-400" />
                  <span>Notification Center</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed">
              💡 <strong>Remember:</strong> Even if Responder Mode is active, you retain full access to request help anytime if you encounter danger.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
