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
import { RequestHelpButton } from '../../components/ui/RequestHelpButton';

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
    <div className="min-h-screen bg-[#070B14] text-slate-100 overflow-x-hidden selection:bg-emergency-500 selection:text-white">
      
      {/* 1. Cinematic 3D Emergency Hero */}
      <CharacterCarousel />

      {/* 2. "When Help Can't Wait" Statement Section */}
      <section className="py-20 px-4 sm:px-8 border-t border-b border-white/10 bg-gradient-to-b from-[#070B14] to-[#0B1020]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emergency-400">
            Emergency Response Re-engineered
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight leading-tight font-display">
            When help can’t wait, bureaucracy shouldn’t stand in the way.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mt-6 leading-relaxed">
            CrisisConnect replaces congested hotlines and fragmented messaging groups with a unified, 
            zero-friction emergency coordination grid. Whether it is rare blood, emergency insulin, or flash-flood evacuation, 
            the closest person or NGO with the capability gets alerted first.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-8 border-t border-white/10 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Zero-Barrier Triage</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Sub-Meter Geolocation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emergency-500" />
              <span>Encrypted Responder Coordination</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Mouse-X Video Scrubbing Section */}
      <VideoScrubber />

      {/* 4. Request → Match → Respond → Resolve */}
      <section ref={worksRef} id="how-it-works" className="py-24 px-4 sm:px-8 bg-[#070B14] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
              The 4-Step Cycle
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-2 font-display">
              How CrisisConnect Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              Fast, practical, and human-centered response cycle designed for critical conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="how-card glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between group hover:border-emergency-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emergency-500/20 border border-emergency-500/30 flex items-center justify-center text-emergency-500 mb-6 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-slate-500 mb-1">01 / DISPATCH</div>
                <h3 className="text-xl font-bold text-white mb-3 font-display">Request</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A person in distress selects required supplies with automatic browser GPS lock. No lengthy forms.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-white/5 text-[11px] font-semibold text-emergency-400">
                Instant Zero-Friction Broadcast →
              </div>
            </div>

            {/* Step 2 */}
            <div className="how-card glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between group hover:border-sky-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
                  <Radio className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-slate-500 mb-1">02 / DISCOVERY</div>
                <h3 className="text-xl font-bold text-white mb-3 font-display">Match</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Telemetry matches incident coordinates with nearby active responders and equipped NGO inventory in the radius.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-white/5 text-[11px] font-semibold text-sky-400">
                Localized Proximity Matching →
              </div>
            </div>

            {/* Step 3 */}
            <div className="how-card glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between group hover:border-emerald-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-slate-500 mb-1">03 / ACTION</div>
                <h3 className="text-xl font-bold text-white mb-3 font-display">Respond</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A responder or organization accepts the task. Secure real-time coordination chat and location route unlock.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-white/5 text-[11px] font-semibold text-emerald-400">
                Encrypted Coordination →
              </div>
            </div>

            {/* Step 4 */}
            <div className="how-card glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between group hover:border-amber-500/40 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono font-bold text-slate-500 mb-1">04 / CLOSURE</div>
                <h3 className="text-xl font-bold text-white mb-3 font-display">Resolve</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Assistance is delivered, medical or safety verification is logged, and the incident resolves with full accountability.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-white/5 text-[11px] font-semibold text-amber-400">
                Verified Resolution →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5, 6, 7. Audiences: Requesters / Responders / NGOs */}
      <section className="py-24 px-4 sm:px-8 bg-[#0B1020] border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display">
              Designed For Every Role in the Crisis
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              One platform balancing citizen emergency access, community helper capabilities, and large-scale NGO logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Requester */}
            <div className="glass-panel rounded-3xl p-8 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emergency-500/20 text-emergency-500 flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white font-display">People Who Need Help</h3>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Zero friction. Tap Request Help, select what you need, and GPS handles the rest. 
                  Watch live tracking as a responder is dispatched and communicate directly via private chat.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="text-emergency-500">✓</span> Multi-select essential needs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emergency-500">✓</span> Automatic browser geolocation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emergency-500">✓</span> Live timeline & direct phone dialer
                  </li>
                </ul>
              </div>
              <Link
                to="/request-help"
                className="mt-8 py-3 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white font-bold text-xs text-center uppercase tracking-wider transition-colors"
              >
                Request Assistance Now
              </Link>
            </div>

            {/* Responder */}
            <div className="glass-panel rounded-3xl p-8 border border-emerald-500/30 bg-emerald-500/[0.03] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white font-display">People Who Can Respond</h3>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  Any registered user can enable Responder Mode. Choose your specific capabilities (medical, vehicle, food, blood) 
                  and get notified of nearby requests in your neighborhood.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Proximity feed with distance & time
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Capability-specific notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Retain Request Help capability anytime
                  </li>
                </ul>
              </div>
              <Link
                to="/responder"
                className="mt-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center uppercase tracking-wider transition-colors"
              >
                Enable Responder Mode
              </Link>
            </div>

            {/* NGO */}
            <div className="glass-panel rounded-3xl p-8 border border-sky-500/30 bg-sky-500/[0.03] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white font-display">NGOs & Organizations</h3>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  An incident command dashboard for relief agencies. Access the exclusive Live Emergency Map, 
                  manage supplies (blood, kits, shelter beds), and coordinate large-scale relief operations.
                </p>
                <ul className="mt-6 space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="text-sky-400">✓</span> Real-time Live Emergency Map
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sky-400">✓</span> Disaster resource inventory tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sky-400">✓</span> Multi-incident triage & team dispatch
                  </li>
                </ul>
              </div>
              <Link
                to="/ngo/dashboard"
                className="mt-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs text-center uppercase tracking-wider transition-colors"
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
      <section id="crisis-ai" className="py-24 px-4 sm:px-8 bg-[#0B1020] border-t border-b border-white/10">
        <div className="max-w-5xl mx-auto glass-panel rounded-3xl p-8 sm:p-12 border border-sky-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-xs font-bold uppercase tracking-wider text-sky-400 mb-4">
              <Bot className="w-4 h-4" />
              <span>Embedded AI Protocol Assistant</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
              CrisisAI: Instant Safety Guidance
            </h2>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              When panic strikes, clear step-by-step instructions save lives. CrisisAI provides instant 
              first-aid protocols for unconsciousness, severe bleeding, burns, and choking while responders are on the way.
            </p>
            <p className="text-[11px] text-amber-400 mt-4 font-mono">
              ⚠️ General safety guidance only. Does not replace 911 or emergency medical professionals.
            </p>
          </div>

          <div className="w-full md:w-80 p-5 rounded-2xl bg-slate-900/90 border border-white/15 text-xs space-y-3 shrink-0 shadow-2xl">
            <div className="flex items-center gap-2 text-sky-400 font-bold border-b border-white/10 pb-2">
              <Bot className="w-4 h-4" />
              <span>Ask CrisisAI</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 text-slate-300">
              "How can I help someone who is bleeding?"
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 text-slate-300">
              "What should I do if someone is unconscious?"
            </div>
            <div className="text-[10px] text-slate-500 text-center font-mono">
              Click the floating 🤖 CrisisAI launcher anytime
            </div>
          </div>
        </div>
      </section>

      {/* 10. Final Emergency CTA */}
      <section className="py-24 px-4 sm:px-8 bg-[#070B14] relative text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emergency-500">
            Every Second Counts
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-white mt-3 font-display tracking-tight leading-tight">
            WHEN EVERY SECOND MATTERS,<br />
            <span className="text-emergency-500">CONNECTION MATTERS.</span>
          </h2>
          <p className="text-base text-slate-400 mt-4 max-w-xl mx-auto">
            Join thousands of citizens, community responders, and verified relief organizations working together to build a faster safety net.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <RequestHelpButton variant="hero" />
            <Link
              to="/signup?role=user"
              className="px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-lg"
            >
              Become A Responder
            </Link>
            <Link
              to="/signup?role=ngo"
              className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider border border-white/15 transition-colors"
            >
              Join As Organization
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Accessible Footer */}
      <footer className="py-12 px-4 sm:px-8 border-t border-white/10 bg-[#070B14] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emergency-600/30 border border-emergency-500/40 flex items-center justify-center text-emergency-500">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-white font-display tracking-wider">CRISISCONNECT</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Connecting people, responders, and organizations when help matters most.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#network" className="hover:text-white transition-colors">Mesh Network</a>
            <a href="#crisis-ai" className="hover:text-white transition-colors">CrisisAI</a>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/5 text-center text-[10px] text-slate-600">
          Disclaimer: CrisisConnect connects you with available community assistance and does not replace official municipal 911/112 emergency services.
        </div>
      </footer>

    </div>
  );
};
