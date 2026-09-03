import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { 
  AlertTriangle, 
  Shield, 
  Users, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  MapPin, 
  Clock, 
  Heart,
  Radio
} from 'lucide-react';
import { CharacterCarousel } from '../../components/landing/CharacterCarousel';
import { VideoScrubber } from '../../components/landing/VideoScrubber';
import { NetworkVisual } from '../../components/landing/NetworkVisual';
import { 
  RequesterMotionWidget, 
  ResponderMotionWidget, 
  NGOMotionWidget 
} from '../../components/landing/RoleMotionWidgets';

export const LandingPage: React.FC = () => {
  const worksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.how-card', {
        scrollTrigger: {
          trigger: worksRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
      });
    }, worksRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-theme-light text-theme-dark overflow-x-hidden selection:bg-emergency-500 selection:text-white">
      
      {/* 1. Cinematic 3D Emergency Hero */}
      <CharacterCarousel />

      {/* 2. "When Help Can't Wait" Statement Section */}
      <section className="py-20 px-4 sm:px-8 border-t border-b border-theme-mint/30 bg-theme-dark">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emergency-500/10 border border-emergency-500/30 text-xs font-mono font-bold uppercase tracking-widest text-emergency-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emergency-500 animate-pulse" />
            Emergency Response Re-engineered
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-theme-light tracking-tight leading-tight font-display">
            When help can’t wait,<br className="hidden sm:inline" /> bureaucracy shouldn’t stand in the way.
          </h2>

          {/* Motionsites.ai Inspired 3-Stat Glanceable Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-theme-mint/30 flex flex-col items-center text-center group hover:border-emergency-500/40 transition-colors">
              <span className="text-2xl sm:text-3xl font-black text-theme-dark font-display">0 Forms</span>
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mt-1.5">● 1-Tap GPS Lock</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-theme-mint/30 flex flex-col items-center text-center group hover:border-sky-500/40 transition-colors">
              <span className="text-2xl sm:text-3xl font-black text-theme-dark font-display">&lt; 3 Sec</span>
              <span className="text-[11px] font-mono text-sky-400 uppercase tracking-wider mt-1.5">● Proximity Ping</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-theme-mint/30 flex flex-col items-center text-center group hover:border-emerald-500/40 transition-colors">
              <span className="text-2xl sm:text-3xl font-black text-theme-dark font-display">100% Direct</span>
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider mt-1.5">● Route & Private Chat</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Mouse-X Video Scrubbing Section */}
      <VideoScrubber />

      {/* 4. Request → Match → Respond → Resolve */}
      <section ref={worksRef} id="how-it-works" className="scroll-mt-20 py-24 px-4 sm:px-8 bg-theme-light relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
              The 4-Step Cycle
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-theme-dark mt-2 font-display">
              How CrisisConnect Works
            </h2>
            <p className="text-sm sm:text-base text-theme-forest/80 mt-3">
              Fast, practical, and human-centered response cycle designed for critical conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="how-card glass-panel rounded-3xl p-6 sm:p-7 border border-theme-mint/30 flex flex-col justify-between group hover:border-emergency-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emergency-500/20 border border-emergency-500/30 flex items-center justify-center text-emergency-500 mb-6 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-theme-forest/60 mb-1">01 / DISPATCH</div>
                <h3 className="text-xl font-bold text-theme-dark font-display">1-Tap Request</h3>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emergency-500/10 border border-emergency-500/20 text-[11px] font-mono text-emergency-400">
                  <span>GPS Lock • Zero Forms</span>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-theme-mint/20 text-[11px] font-semibold text-emergency-400">
                Instant Transmission →
              </div>
            </div>

            {/* Step 2 */}
            <div className="how-card glass-panel rounded-3xl p-6 sm:p-7 border border-theme-mint/30 flex flex-col justify-between group hover:border-sky-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
                  <Radio className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-theme-forest/60 mb-1">02 / DISCOVERY</div>
                <h3 className="text-xl font-bold text-theme-dark font-display">Proximity Match</h3>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-400/20 text-[11px] font-mono text-sky-400">
                  <span>Local Mesh Radius Broadcast</span>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-theme-mint/20 text-[11px] font-semibold text-sky-400">
                Instant Alert →
              </div>
            </div>

            {/* Step 3 */}
            <div className="how-card glass-panel rounded-3xl p-6 sm:p-7 border border-theme-mint/30 flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-theme-forest/60 mb-1">03 / ACTION</div>
                <h3 className="text-xl font-bold text-theme-dark font-display">Direct Respond</h3>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-[11px] font-mono text-emerald-400">
                  <span>Private Route & Chat</span>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-theme-mint/20 text-[11px] font-semibold text-emerald-400">
                Direct Coordination →
              </div>
            </div>

            {/* Step 4 */}
            <div className="how-card glass-panel rounded-3xl p-6 sm:p-7 border border-theme-mint/30 flex flex-col justify-between group hover:border-amber-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-theme-forest/60 mb-1">04 / CLOSURE</div>
                <h3 className="text-xl font-bold text-theme-dark font-display">Verified Safe</h3>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-400/20 text-[11px] font-mono text-amber-400">
                  <span>Mission Logged & Closed</span>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-theme-mint/20 text-[11px] font-semibold text-amber-400">
                Verified Resolution →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5, 6, 7. Audiences: Requesters / Responders / NGOs */}
      <section className="py-24 px-4 sm:px-8 bg-[#0B1020] border-t border-b border-theme-mint/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-theme-dark font-display">
              Designed For Every Role in the Crisis
            </h2>
            <p className="text-sm sm:text-base text-theme-forest/80 mt-3">
              One platform balancing citizen emergency access, community helper capabilities, and large-scale NGO logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Requester */}
            <div className="glass-panel rounded-3xl p-7 sm:p-8 border border-emergency-500/30 bg-emergency-500/[0.03] flex flex-col justify-between h-full group hover:border-emergency-500/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emergency-500/20 text-emergency-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emergency-400 font-bold px-2.5 py-1 rounded-full bg-emergency-500/10 border border-emergency-500/25">
                    Distress Mode
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-theme-dark font-display">People Who Need Help</h3>
                <p className="text-xs text-theme-forest mt-2 mb-4 leading-relaxed line-clamp-2">
                  1-tap distress broadcast with automated high-precision GPS lock—signaling nearby community helpers and equipped NGOs.
                </p>

                {/* Living Micro-UI Widget */}
                <RequesterMotionWidget />
              </div>

              <Link
                to="/request-help"
                className="mt-6 py-3 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white font-bold text-xs text-center uppercase tracking-wider transition-colors shadow-md shadow-emergency-600/20 active:scale-95"
              >
                Request Assistance Now
              </Link>
            </div>

            {/* Responder */}
            <div className="glass-panel rounded-3xl p-7 sm:p-8 border border-emerald-500/30 bg-emerald-500/[0.03] flex flex-col justify-between h-full group hover:border-emerald-500/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                    Standby Mode
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-theme-dark font-display">People Who Can Respond</h3>
                <p className="text-xs text-theme-forest mt-2 mb-4 leading-relaxed line-clamp-2">
                  Enable standby mode with your verified skills to receive instant proximity alerts and unlock secure navigation routes.
                </p>

                {/* Living Micro-UI Widget */}
                <ResponderMotionWidget />
              </div>

              <Link
                to="/responder"
                className="mt-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center uppercase tracking-wider transition-colors shadow-md shadow-emerald-600/20 active:scale-95"
              >
                Enable Responder Mode
              </Link>
            </div>

            {/* NGO */}
            <div className="glass-panel rounded-3xl p-7 sm:p-8 border border-sky-500/30 bg-sky-500/[0.03] flex flex-col justify-between h-full group hover:border-sky-500/50 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/25">
                    Command HQ
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-theme-dark font-display">NGOs & Organizations</h3>
                <p className="text-xs text-theme-forest mt-2 mb-4 leading-relaxed line-clamp-2">
                  Unified incident command dashboard to access live emergency triage maps, manage disaster inventory, and dispatch teams.
                </p>

                {/* Living Micro-UI Widget */}
                <NGOMotionWidget />
              </div>

              <Link
                to="/ngo/dashboard"
                className="mt-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs text-center uppercase tracking-wider transition-colors shadow-md shadow-sky-600/20 active:scale-95"
              >
                Access NGO Command
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Real-Time Emergency Network Visual */}
      <NetworkVisual />

      {/* 9. CrisisAI Spotlight Section */}
      <section id="crisis-ai" className="scroll-mt-20 py-24 px-4 sm:px-8 bg-[#0B1020] border-t border-b border-theme-mint/30">
        <div className="max-w-5xl mx-auto glass-panel rounded-3xl p-8 sm:p-12 border border-sky-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-xs font-bold uppercase tracking-wider text-sky-400 mb-4">
              <Bot className="w-4 h-4" />
              <span>Embedded AI Protocol Assistant</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-theme-dark font-display">
              CrisisAI: Instant Safety Guidance
            </h2>
            <p className="text-sm text-theme-forest mt-2 leading-relaxed">
              Step-by-step first-aid protocols while responders are en route.
            </p>

            {/* Motionsites.ai Protocol Chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-theme-mint/30 text-xs font-mono text-theme-forest">
                🫀 CPR Steps
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-theme-mint/30 text-xs font-mono text-theme-forest">
                🩸 Severe Bleeding
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-theme-mint/30 text-xs font-mono text-theme-forest">
                🔥 Burns Relief
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-theme-mint/30 text-xs font-mono text-theme-forest">
                🗣️ Choking (Heimlich)
              </span>
            </div>

            <p className="text-[11px] text-amber-400 mt-4 font-mono">
              ⚠️ General safety guidance only. Does not replace 911 or emergency medical professionals.
            </p>
          </div>

          <div className="w-full md:w-80 p-5 rounded-2xl bg-white/90 border border-theme-mint/40 text-xs space-y-3 shrink-0 shadow-2xl">
            <div className="flex items-center gap-2 text-sky-400 font-bold border-b border-theme-mint/30 pb-2">
              <Bot className="w-4 h-4" />
              <span>Ask CrisisAI</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 text-theme-forest">
              "How can I help someone who is bleeding?"
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 text-theme-forest">
              "What should I do if someone is unconscious?"
            </div>
            <div className="text-[10px] text-theme-forest/60 text-center font-mono">
              Click the floating 🤖 CrisisAI launcher anytime
            </div>
          </div>
        </div>
      </section>

      {/* 10. About Us Section */}
      <section id="about" className="scroll-mt-20 py-24 px-4 sm:px-8 bg-theme-light border-t border-theme-mint/30 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emergency-500">
              Our Mission & Foundation
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 font-display">
              About CrisisConnect
            </h2>
            <p className="text-sm sm:text-base text-theme-forest mt-4 leading-relaxed">
              CrisisConnect was founded with a singular purpose: to close the critical time gap between an emergency occurring and verified assistance arriving on the ground.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-6 border border-theme-mint/30 hover:border-emergency-500/40 transition-colors">
              <div className="text-emergency-500 font-mono text-xs font-bold uppercase tracking-wider mb-2">01 / The Problem</div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Hotlines Overload</h3>
              <p className="text-xs text-theme-forest/80 leading-relaxed">
                Central emergency hotlines freeze during widespread disasters.
              </p>
              <div className="mt-4 pt-3 border-t border-theme-mint/20 text-[11px] font-mono text-emergency-400">
                ● Congested Dispatch Lines
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-theme-mint/30 hover:border-sky-500/40 transition-colors">
              <div className="text-sky-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">02 / The Solution</div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Hyperlocal Mesh</h3>
              <p className="text-xs text-theme-forest/80 leading-relaxed">
                Trained neighbors with CPR, trucks, or supplies respond in minutes.
              </p>
              <div className="mt-4 pt-3 border-t border-theme-mint/20 text-[11px] font-mono text-sky-400">
                ● First-Line Safety Net
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-theme-mint/30 hover:border-emerald-500/40 transition-colors">
              <div className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">03 / The Standard</div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Private & Verified</h3>
              <p className="text-xs text-theme-forest/80 leading-relaxed">
                Location data shared only with the accepted responder.
              </p>
              <div className="mt-4 pt-3 border-t border-theme-mint/20 text-[11px] font-mono text-emerald-400">
                ● Zero Data Selling
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Final Emergency CTA */}
      <section className="py-24 px-4 sm:px-8 bg-[#0B1020] border-t border-theme-mint/30 relative text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emergency-500">
            Every Second Counts
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-white mt-3 font-display tracking-tight leading-tight">
            WHEN EVERY SECOND MATTERS,<br />
            <span className="text-emergency-500">CONNECTION MATTERS.</span>
          </h2>
          <p className="text-base text-theme-forest/80 mt-4 max-w-xl mx-auto">
            Join thousands of citizens, community responders, and verified relief organizations working together to build a faster safety net.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              to="/request-help"
              className="px-6 py-4 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-lg shadow-emergency-600/20"
            >
              Request Help Now
            </Link>
            <Link
              to="/signup?role=user"
              className="px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-lg"
            >
              Become A Responder
            </Link>
            <Link
              to="/signup?role=ngo"
              className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-theme-dark font-bold text-sm uppercase tracking-wider border border-theme-mint/40 transition-colors"
            >
              Join As Organization
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Accessible Footer */}
      <footer className="py-12 px-4 sm:px-8 border-t border-theme-mint/30 bg-theme-light text-xs text-theme-forest/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emergency-600/30 border border-emergency-500/40 flex items-center justify-center text-emergency-500">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-theme-dark font-display tracking-wider">CRISISCONNECT</span>
            </div>
            <p className="text-[11px] text-theme-forest/60 mt-1">
              Connecting people, responders, and organizations when help matters most.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#network" className="hover:text-white transition-colors">Mesh Network</a>
            <a href="#crisis-ai" className="hover:text-white transition-colors">CrisisAI</a>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-theme-mint/20 text-center text-[10px] text-slate-600">
          Disclaimer: CrisisConnect connects you with available community assistance and does not replace official municipal 911/112 emergency services.
        </div>
      </footer>

    </div>
  );
};
