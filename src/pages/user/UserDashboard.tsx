import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle,
  Bell,
  Users,
  ChevronRight,
  Heart,
  Activity,
  MapPin
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { GlassCard } from '../../components/ui/GlassCard';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { PriorityBreakdownModal } from '../../components/emergency/PriorityBreakdownModal';
import { EmergencyRequest } from '../../types';

export const UserDashboard: React.FC = () => {
  const { currentUser, isResponder } = useAuth();
  const { myRequests, activeCount, nearbyRequests, acceptRequest } = useEmergency();
  const navigate = useNavigate();
  
  const [selectedRequest, setSelectedRequest] = React.useState<EmergencyRequest | null>(null);

  const userName = currentUser && 'name' in currentUser ? currentUser.name : 'Citizen';

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

          <Link
            to="/request-help"
            className="inline-flex min-h-14 min-w-[220px] items-center justify-center gap-3 rounded-full border-2 border-red-600 bg-red-600 px-8 py-4 font-display text-lg font-black uppercase tracking-[.3em] text-white shadow-[0_14px_30px_rgba(231,70,54,.28)] transition hover:border-black hover:bg-black active:scale-95 sm:min-w-[280px] sm:text-xl"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>S O S</span>
          </Link>
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
                <p className="mt-5 max-w-md text-sm leading-relaxed text-black/70 sm:text-base">
                  Share what is happening, where you are, and what kind of support is needed. Your request stays open until help accepts it and coordination is complete.
                </p>
              </div>

              <div className="mt-6">
                <span className="font-mono text-[11px] uppercase tracking-wider text-black/70">
                  No lengthy forms / Automatic GPS
                </span>
              </div>
            </div>

          </motion.div>

          <div className="relative overflow-hidden rounded-[2rem] border-2 border-black bg-white p-6 sm:p-10">
            <img src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1000&q=85" alt="Medical responder preparing care" loading="lazy" className="h-56 w-full rounded-[1.5rem] object-cover grayscale-[.15] sm:h-72" />
            <motion.p ref={storyRef} style={{ y: storyY, opacity: storyOpacity }} className="mt-6 max-w-md font-instrument text-2xl leading-tight text-black sm:text-4xl">“Your coordinates, your need, and a direct line to people who can act.”</motion.p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-red-600">Verified community response</p>
              <Link to="/request-help" className="inline-flex min-h-14 w-full items-center justify-center rounded-full border-2 border-red-600 bg-red-600 px-6 py-4 font-display text-lg font-black uppercase tracking-[.25em] text-white transition hover:border-black hover:bg-black active:scale-95">S O S</Link>
            </div>
          </div>
        </section>

        {/* Dashboard Grid: Recent Requests & Nearby Incidents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* My Recent Requests (2 cols) */}
          <div className="lg:col-span-2 space-y-4 rounded-[2rem] border border-black/10 bg-white/95 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.14)]">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                  My Emergency Requests
                </h3>
              </div>
              <Link to="/requests" className="text-xs font-semibold text-red-600 hover:underline">
                View All
              </Link>
            </div>

            {myRequests.length === 0 ? (
              <div className="py-12 text-center text-xs text-black/55">
                No emergency requests yet. You're all clear.
              </div>
            ) : (
              <div className="space-y-3">
                {myRequests.slice(0, 3).map((req) => (
                  <Link
                    key={req.id}
                    to={`/requests/${req.id}`}
                    className="block flex items-center justify-between gap-4 rounded-xl border border-black/10 bg-[#f4f5f8] p-4 transition-all hover:border-red-300 hover:bg-red-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-black">
                          {req.needs.join(', ')}
                        </span>
                        <PriorityBadge level={req.priorityLevel} score={req.priorityScore} size="sm" />
                        <StatusBadge status={req.status} size="sm" />
                      </div>
                      <p className="max-w-md truncate text-xs text-black/60">
                        {req.description}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-red-600" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Capabilities Sidebar */}
          <div className="space-y-4 rounded-[2rem] border border-black/10 bg-white/95 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.14)]">
            <div className="border-b border-black/10 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-black">
                Quick Actions
              </h3>
            </div>

            <div className="space-y-2.5">
              <Link
                to="/request-help"
                className="flex w-full items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-black transition-colors hover:bg-red-100"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span>Request Emergency Aid</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-red-600" />
              </Link>

              <Link
                to="/notifications"
                className="flex w-full items-center justify-between rounded-xl border border-black/10 bg-[#f4f5f8] p-3 text-xs font-medium text-black transition-colors hover:border-red-200 hover:bg-red-50"
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-red-600" />
                  <span>Notification Center</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-red-600" />
              </Link>

              <Link
                to="/request-help"
                className="flex w-full items-center justify-between rounded-xl border-2 border-red-600 bg-red-600 p-3 text-xs font-black uppercase tracking-[.2em] text-white transition-colors hover:border-black hover:bg-black"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>S O S</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>

        </div>

        {/* Priority Response Queue for Responders */}
        {isResponder && nearbyRequests.length > 0 && (
          <div className="space-y-4 rounded-[2rem] border border-black/10 bg-white/95 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.14)] mt-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-black">
                  Responder Live Queue
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Sorted by Priority Engine
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...nearbyRequests]
                .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
                .slice(0, 4)
                .map((req) => (
                <div key={req.id} className="rounded-xl border border-black/10 bg-[#f4f5f8] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-sm text-black">{req.needs.join(', ')}</h4>
                      <button onClick={() => setSelectedRequest(req)} className="transition hover:scale-105 active:scale-95">
                        <PriorityBadge level={req.priorityLevel} score={req.priorityScore} />
                      </button>
                    </div>
                    <p className="text-xs text-black/60 line-clamp-2 mb-3">{req.description}</p>
                    <div className="flex items-center gap-1 text-[11px] text-black/50 mb-4">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{req.location.address || 'Detected Location'} • {req.distanceKm || '1.2'} km</span>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      await acceptRequest(req.id);
                      navigate(`/requests/${req.id}`);
                    }}
                    className="w-full py-2.5 rounded-lg bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-black/80 transition-colors"
                  >
                    Accept & Dispatch
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      
      {selectedRequest && (
        <PriorityBreakdownModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
        />
      )}
    </div>
  );
};
