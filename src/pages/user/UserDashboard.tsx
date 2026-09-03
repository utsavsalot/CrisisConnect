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

          {/* Header button removed as requested */}
        </div>

        {/* Top 2 Primary Cards: Need Help Banner & Responder Mode Toggle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Main Emergency CTA Card */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emergency-900/40 via-slate-900/80 to-slate-950 border border-emergency-500/30 shadow-emergency-glow/20 flex flex-col sm:flex-row gap-6 overflow-hidden group">
            <div className="flex-1 flex flex-col justify-between relative z-10">
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

              <div className="mt-6">
                <span className="text-[11px] text-slate-400 font-mono">
                  No lengthy forms • Automatic GPS
                </span>
              </div>
            </div>

            <Link
              to="/request-help"
              className="w-full sm:w-[30%] sm:shrink-0 min-h-[220px] rounded-[2.5rem] bg-gradient-to-b from-emergency-900/20 to-emergency-950/60 text-white flex flex-col items-center justify-center gap-5 transition-all active:scale-95 relative z-10 p-6 text-center border border-emergency-500/40 shadow-[0_0_40px_rgba(239,68,68,0.2)_inset] hover:shadow-[0_0_50px_rgba(239,68,68,0.3)_inset,0_0_20px_rgba(239,68,68,0.3)] group overflow-hidden backdrop-blur-md"
            >
              {/* High-tech Glowing Edges */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[4px] bg-emergency-400 shadow-[0_0_20px_5px_rgba(239,68,68,0.7)]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[4px] bg-emergency-400 shadow-[0_0_20px_5px_rgba(239,68,68,0.7)]" />

              {/* Dot Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_center,_#ef4444_1px,_transparent_1px)] bg-[length:10px_10px]" />

              <AlertTriangle className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] relative z-10 transition-transform group-hover:scale-110" />

              <span className="font-black text-2xl sm:text-[28px] uppercase tracking-widest leading-[1.1] relative z-10 drop-shadow-md">
                REQUEST<br />HELP<br />NOW
              </span>
            </Link>
          </div>

          {/* Responder Mode Card */}
          <div className={`rounded-3xl p-6 sm:p-8 border transition-all flex flex-col justify-between ${isResponder && isAvailable
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
                    className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${isResponder && isAvailable ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
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
          <div className="relative rounded-[2.5rem] p-6 sm:p-8 border border-white/10 bg-slate-950 overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-2xl">
            
            {/* Background Map Graphic - Realistic Roads */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 1000 500" className="min-w-full min-h-full object-cover text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M-100,200 L150,150 L250,250 L450,200 L600,250 L900,100" />
                <path d="M200,-50 L250,100 L200,200 L300,350 L250,550" />
                <path d="M450,-50 L420,150 L350,250 L400,450" />
                <path d="M-50,300 L150,320 L250,250 L400,280 L550,200 L750,250 L900,200" />
                <path d="M150,150 L100,50 L300,-50" />
                <path d="M600,250 L650,400 L800,450" />
                <path d="M300,350 L450,380 L600,300" />
                <path d="M650,50 L750,150 L900,180" />
                <path d="M800,-50 L750,150 L800,300 L700,500" />
                <path d="M50,100 L200,100 L300,50" />
              </svg>
            </div>
            {/* Gradient overlays to blend map edges */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 pointer-events-none opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none opacity-80" />

            {/* Left Section: Details */}
            <div className="relative z-10 flex-1 min-w-0 max-w-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emergency-950/80 border border-emergency-500/50 flex items-center justify-center text-emergency-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] shrink-0">
                  <Activity className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      Your Active Emergency
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emergency-500/20 border border-emergency-500/30 text-emergency-400 text-[9px] font-black tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emergency-500 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-wide pr-32">
                    {activeRequest.needs.join(', ') || 'Emergency Assistance'}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-3 truncate pr-32">
                {activeRequest.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
                <Shield className="w-4 h-4" />
                <span>{activeRequest.location.address || 'Detected Location'}</span>
              </div>
            </div>

            {/* Middle Section: GPS Pin (Absolute Centered) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center pointer-events-none">
              {/* GPS Pin with radar rings */}
              <div className="relative flex items-center justify-center w-20 h-20">
                <div className="absolute inset-0 border border-slate-500/40 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <div className="absolute inset-3 border border-slate-400/50 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite_0.8s]" />
                <div className="absolute inset-6 border border-slate-300/60 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite_1.6s]" />
                <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center relative z-10 shadow-lg backdrop-blur-md">
                  <MapPin className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
            </div>

            {/* Top Right Section: Glowing Button */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20">
              <Link
                to={`/requests/${activeRequest.id}`}
                className="relative group px-5 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-400 text-white font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4),inset_0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6),inset_0_0_15px_rgba(6,182,212,0.5)] hover:bg-cyan-500/20 backdrop-blur-sm"
              >
                <span className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">Live Tracking & Chat</span>
                <span className="bg-emergency-500 text-white text-[8px] px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.9)] animate-pulse border border-white/30">
                  LIVE
                </span>
              </Link>
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
