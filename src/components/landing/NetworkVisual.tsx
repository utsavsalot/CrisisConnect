import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { User, MapPin, Shield, Building2, Radio, CheckCircle2 } from 'lucide-react';

export const NetworkVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Loop request propagation signal along lines
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      tl.fromTo(
        '.signal-requester',
        { scale: 0.8, opacity: 0.4 },
        { scale: 1.4, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );

      tl.fromTo(
        '#path-req-loc',
        { strokeDashoffset: 300 },
        { strokeDashoffset: 0, duration: 0.8, ease: 'power1.inOut' }
      );

      tl.fromTo(
        '.signal-location',
        { scale: 0.8, opacity: 0.4 },
        { scale: 1.3, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );

      tl.fromTo(
        ['#path-loc-resp1', '#path-loc-resp2', '#path-loc-ngo'],
        { strokeDashoffset: 300 },
        { strokeDashoffset: 0, duration: 0.9, stagger: 0.2, ease: 'power1.inOut' }
      );

      tl.fromTo(
        ['.signal-resp1', '.signal-resp2', '.signal-ngo'],
        { scale: 0.8, opacity: 0.4 },
        { scale: 1.3, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'back.out(2)' }
      );

      tl.to({}, { duration: 1 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="network" ref={containerRef} className="py-20 px-4 sm:px-8 bg-[#070B14] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emergency-500/10 border border-emergency-500/30 text-xs font-bold uppercase tracking-wider text-emergency-400 mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Telemetry Propagation Mesh</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-display">
            Real-Time Emergency Network
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">
            How a zero-friction distress signal instantly triangulates and connects to verified nearby resources.
          </p>
        </div>

        {/* Network Nodes Visualization Canvas */}
        <div className="relative w-full max-w-4xl mx-auto h-[460px] sm:h-[500px] glass-panel rounded-3xl p-6 border border-white/10 overflow-hidden flex items-center justify-center">
          
          {/* SVG Connection Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 500">
            <defs>
              <linearGradient id="grad-req-loc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="grad-loc-resp" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
            </defs>

            {/* Requester -> Location */}
            <path
              id="path-req-loc"
              d="M 160 250 L 380 250"
              fill="none"
              stroke="url(#grad-req-loc)"
              strokeWidth="3"
              strokeDasharray="300"
            />

            {/* Location -> Responder 1 (Top) */}
            <path
              id="path-loc-resp1"
              d="M 420 230 C 480 180, 560 140, 640 140"
              fill="none"
              stroke="url(#grad-loc-resp)"
              strokeWidth="3"
              strokeDasharray="300"
            />

            {/* Location -> Responder 2 (Middle) */}
            <path
              id="path-loc-resp2"
              d="M 420 250 L 640 250"
              fill="none"
              stroke="url(#grad-loc-resp)"
              strokeWidth="3"
              strokeDasharray="300"
            />

            {/* Location -> NGO Command (Bottom) */}
            <path
              id="path-loc-ngo"
              d="M 420 270 C 480 320, 560 360, 640 360"
              fill="none"
              stroke="url(#grad-loc-resp)"
              strokeWidth="3"
              strokeDasharray="300"
            />
          </svg>

          {/* Node 1: Requester */}
          <div className="absolute left-8 sm:left-16 top-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="signal-requester w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emergency-600/30 border-2 border-emergency-500 flex items-center justify-center text-emergency-500 shadow-emergency-glow">
              <User className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <span className="text-xs font-bold text-white mt-3 uppercase tracking-wider">Citizen In Need</span>
            <span className="text-[10px] text-emergency-400 font-mono">0.0s Distress Signal</span>
          </div>

          {/* Node 2: Triangulation Location */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="signal-location w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-sky-600/30 border-2 border-sky-400 flex items-center justify-center text-sky-400 shadow-tech-glow">
              <MapPin className="w-7 h-7 sm:w-9 sm:h-9 animate-bounce" />
            </div>
            <span className="text-xs font-bold text-white mt-3 uppercase tracking-wider">GPS Triangulation</span>
            <span className="text-[10px] text-sky-400 font-mono">Sub-Meter Radius</span>
          </div>

          {/* Node 3: Responders & NGO */}
          <div className="absolute right-8 sm:right-16 top-0 bottom-0 flex flex-col justify-around py-6">
            
            {/* Responder 1 */}
            <div className="flex items-center gap-3">
              <div className="signal-resp1 w-12 h-12 rounded-xl bg-emerald-600/30 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Dr. Sarah (Medical)</div>
                <div className="text-[10px] text-emerald-400 font-mono">0.9 km • 2m ETA</div>
              </div>
            </div>

            {/* Responder 2 */}
            <div className="flex items-center gap-3">
              <div className="signal-resp2 w-12 h-12 rounded-xl bg-emerald-600/30 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Marcus (Rescue/Van)</div>
                <div className="text-[10px] text-emerald-400 font-mono">1.8 km • 5m ETA</div>
              </div>
            </div>

            {/* NGO Ops */}
            <div className="flex items-center gap-3">
              <div className="signal-ngo w-12 h-12 rounded-xl bg-sky-600/30 border-2 border-sky-400 flex items-center justify-center text-sky-300">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Metro Relief NGO HQ</div>
                <div className="text-[10px] text-sky-400 font-mono">Ambulance & Blood Bank</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
