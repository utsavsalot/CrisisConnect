import React, { useRef } from 'react';
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
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { GlassCard } from '../../components/ui/GlassCard';

export const UserDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { myRequests, activeCount } = useEmergency();
  const navigate = useNavigate();

  const userName = currentUser && 'name' in currentUser ? currentUser.name : 'Citizen';

  // Find active request if any
  const activeRequest = myRequests.find(r => r.status === 'active' || r.status === 'accepted' || r.status === 'in_progress');
  const dashboardRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start 0.8', 'end 0.2'] });
  const storyY = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const storyOpacity = useTransform(scrollYProgress, [0, 0.25, 1], [0.35, 1, 1]);

  return (
    <div ref={dashboardRef} className="min-h-screen bg-[#f4f5f8] px-4 py-8 text-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">

        {/* Greeting Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-black/15 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[.2em] text-red-600">
                Citizen Incident Center
              </span>
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <h1 className="mt-1 font-display text-4xl font-black uppercase leading-none text-black sm:text-6xl">
              Good day, {userName}
            </h1>
            <p className="mt-3 text-sm text-black/60">
              Community status: <span className="font-semibold text-red-600">{activeCount} active emergencies</span> in your region.
            </p>
          </div>

          {/* Header button removed as requested */}
        </div>

        <section className="grid min-h-[calc(100vh-12rem)] items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">

          {/* Main Emergency CTA Card */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="relative overflow-hidden rounded-[2rem] border-2 border-black bg-[#e74636] p-7 shadow-[0_22px_55px_rgba(231,70,54,.22)] sm:p-10">
            <div className="flex-1 flex flex-col justify-between relative z-10">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[.2em] text-black">
                  <span className="h-1.5 w-1.5 rounded-full bg-black animate-ping" />
                  <span>Zero-Friction Emergency</span>
                </div>
                <h2 className="font-display text-4xl font-black uppercase leading-none text-black sm:text-6xl">
                  Need Immediate Help?
                </h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-black/75 sm:text-base">
                  Broadcast an emergency request in under 15 seconds. Nearby verified community responders and NGOs will receive your GPS coordinates.
                </p>
              </div>

              <div className="mt-6">
                <span className="font-mono text-[11px] uppercase tracking-wider text-black/70">
                  No lengthy forms / Automatic GPS
                </span>
              </div>
            </div>

            <Link
              to="/request-help"
              className="relative z-10 flex min-h-[230px] w-full flex-col items-center justify-center gap-5 overflow-hidden rounded-[2rem] border-2 border-black bg-white p-6 text-center text-black transition-all hover:-translate-y-1 active:scale-95 sm:w-[34%] sm:shrink-0"
            >
              {/* High-tech Glowing Edges */}
              <div className="absolute left-1/2 top-0 h-1 w-2/3 -translate-x-1/2 bg-red-600" />
              <div className="absolute bottom-0 left-1/2 h-1 w-2/3 -translate-x-1/2 bg-red-600" />

              {/* Dot Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(circle_at_center,_#e74636_1px,_transparent_1px)] bg-[length:10px_10px]" />

              <AlertTriangle className="relative z-10 h-12 w-12 text-red-600 sm:h-14 sm:w-14" />

              <span className="relative z-10 font-display text-2xl font-black uppercase leading-[1.1] tracking-widest">
                REQUEST<br />HELP<br />NOW
              </span>
            </Link>
          </motion.div>

          <div className="relative overflow-hidden rounded-[2rem] border-2 border-black bg-white p-6 sm:p-10">
            <img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1000&q=85" alt="Medical responder preparing care" loading="lazy" className="h-56 w-full rounded-[1.5rem] object-cover grayscale-[.15] sm:h-72" />
            <motion.p ref={storyRef} style={{ y: storyY, opacity: storyOpacity }} className="mt-6 max-w-md font-instrument text-2xl leading-tight text-black sm:text-4xl">“Your coordinates, your need, and a direct line to people who can act.”</motion.p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-red-600">Verified community response</p>
          </div>
        </section>

        {/* Active Emergency Tracker if current user has an ongoing request */}
        {activeRequest && (
          <div className="relative rounded-[2.5rem] p-6 sm:p-8 border border-theme-mint/30 bg-theme-sage/40 overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-2xl">
            
            {/* Background Map Graphic - Realistic Roads */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 1000 500" className="min-w-full min-h-full object-cover text-theme-dark" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    <span className="text-[11px] font-bold uppercase tracking-widest text-theme-forest/80">
                      Your Active Emergency
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emergency-500/20 border border-emergency-500/30 text-emergency-400 text-[9px] font-black tracking-wider uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emergency-500 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-theme-dark tracking-wide pr-32">
                    {activeRequest.needs.join(', ') || 'Emergency Assistance'}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-theme-forest mb-3 truncate pr-32">
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
                <div className="w-10 h-10 rounded-full bg-theme-sage/80 border border-slate-600 flex items-center justify-center relative z-10 shadow-lg backdrop-blur-md">
                  <MapPin className="w-5 h-5 text-theme-dark drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </div>
              </div>
            </div>

            {/* Top Right Section: Glowing Button */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20">
              <Link
                to={`/requests/${activeRequest.id}`}
                className="relative group px-5 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-400 text-theme-dark font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4),inset_0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6),inset_0_0_15px_rgba(6,182,212,0.5)] hover:bg-cyan-500/20 backdrop-blur-sm"
              >
                <span className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">Live Tracking & Chat</span>
                <span className="bg-emergency-500 text-theme-dark text-[8px] px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.9)] animate-pulse border border-white/30">
                  LIVE
                </span>
              </Link>
            </div>

          </div>
        )}

        {/* Dashboard Grid: Recent Requests & Nearby Incidents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* My Recent Requests (2 cols) */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-theme-mint/30 space-y-4">
            <div className="flex items-center justify-between border-b border-theme-mint/30 pb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-theme-dark">
                  My Emergency Requests
                </h3>
              </div>
              <Link to="/requests" className="text-xs text-sky-400 hover:underline">
                View All
              </Link>
            </div>

            {myRequests.length === 0 ? (
              <div className="text-center py-12 text-xs text-theme-forest/60">
                No emergency requests yet. You're all clear.
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.slice(0, 3).map((req) => (
                  <Link
                    key={req.id}
                    to={`/requests/${req.id}`}
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-theme-mint/20 hover:border-theme-mint/40 transition-all flex items-center justify-between gap-4 block"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-theme-dark">
                          {req.needs.join(', ')}
                        </span>
                        <StatusBadge status={req.status} size="sm" />
                      </div>
                      <p className="text-xs text-theme-forest/80 truncate max-w-md">
                        {req.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-theme-forest/60 shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Capabilities Sidebar */}
          <div className="glass-panel rounded-3xl p-6 border border-theme-mint/30 space-y-4">
            <div className="border-b border-theme-mint/30 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-theme-forest/80">
                Quick Actions
              </h3>
            </div>

            <div className="space-y-2.5">
              <Link
                to="/request-help"
                className="w-full p-3 rounded-xl bg-emergency-600/20 hover:bg-emergency-600/30 border border-emergency-500/30 text-theme-forest font-bold text-xs flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-emergency-500" />
                  <span>Request Emergency Aid</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emergency-400" />
              </Link>

              <Link
                to="/notifications"
                className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-theme-mint/30 text-theme-dark font-medium text-xs flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sky-400" />
                  <span>Notification Center</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-theme-forest/80" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
