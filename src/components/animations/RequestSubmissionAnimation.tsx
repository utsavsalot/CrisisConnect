import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import anime from 'animejs';
import { MapPin, Radio, CheckCircle, Wifi, Users, Shield } from 'lucide-react';

interface RequestSubmissionAnimationProps {
  onComplete: () => void;
}

export const RequestSubmissionAnimation: React.FC<RequestSubmissionAnimationProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  
  const [stepText, setStepText] = useState('Broadcasting emergency beacon...');

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            onCompleteRef.current();
          }, 800);
        }
      });

      // 1. Emergency signal appears & Pin drops
      tl.fromTo(
        pinRef.current,
        { scale: 0, y: -40, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'back.out(2)' }
      );

      // 2. Location pulse / Radar sweeps
      tl.call(() => {
        setStepText('Locking coordinates & scanning radius...');
        if (radarRef.current) {
          anime({
            targets: radarRef.current.querySelectorAll('.radar-wave'),
            scale: [0.2, 2.2],
            opacity: [0.9, 0],
            easing: 'easeOutExpo',
            duration: 1200,
            delay: anime.stagger(220),
            loop: 2
          });
        }
      });

      tl.to({}, { duration: 0.8 });

      // 3. Nearby connection nodes appear
      tl.call(() => {
        setStepText('Finding nearby verified responders & NGOs...');
      });

      tl.fromTo(
        '.network-node',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.12, duration: 0.4, ease: 'elastic.out(1, 0.5)' }
      );

      // 4. Network lines connect
      tl.fromTo(
        '.connection-line',
        { strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }
      );

      // 5. Request activates & Checkmark appears
      tl.call(() => {
        setStepText('Your request is active. Dispatch alerted.');
      });

      tl.to('.radar-layer', { opacity: 0, duration: 0.3 });
      tl.fromTo(
        checkRef.current,
        { scale: 0, rotate: -45, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );

      tl.to({}, { duration: 0.5 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/35 p-6 backdrop-blur-2xl animate-in fade-in duration-200"
    >
      <div className="relative flex w-full max-w-md flex-col items-center overflow-hidden rounded-3xl border border-slate-200 bg-[#fffefa] p-8 text-center text-black shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
        
        {/* Background Radar Rings */}
        <div ref={radarRef} className="radar-layer absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="radar-wave absolute w-32 h-32 rounded-full border border-emergency-500/40" />
          <div className="radar-wave absolute w-48 h-48 rounded-full border border-emergency-500/30" />
          <div className="radar-wave absolute w-64 h-64 rounded-full border border-sky-400/30" />
        </div>

        {/* Central Graphic Container */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200">
            <line
              x1="100" y1="100" x2="40" y2="50"
              stroke="#22D3EE" strokeWidth="2" strokeDasharray="100" className="connection-line"
            />
            <line
              x1="100" y1="100" x2="160" y2="50"
              stroke="#22D3EE" strokeWidth="2" strokeDasharray="100" className="connection-line"
            />
            <line
              x1="100" y1="100" x2="40" y2="150"
              stroke="#34D399" strokeWidth="2" strokeDasharray="100" className="connection-line"
            />
            <line
              x1="100" y1="100" x2="160" y2="150"
              stroke="#34D399" strokeWidth="2" strokeDasharray="100" className="connection-line"
            />
          </svg>

          {/* Peripheral Responder & NGO Nodes */}
          <div ref={nodesRef} className="absolute inset-0">
            <div className="network-node absolute top-4 left-4 p-2 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-400">
              <Users className="w-4 h-4" />
            </div>
            <div className="network-node absolute top-4 right-4 p-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div className="network-node absolute bottom-4 left-4 p-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400">
              <Wifi className="w-4 h-4" />
            </div>
            <div className="network-node absolute bottom-4 right-4 p-2 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>

          {/* Central Pin */}
          <div
            ref={pinRef}
            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-red-500 bg-red-50 text-red-600 shadow-emergency-glow"
          >
            <MapPin className="w-8 h-8 animate-bounce" />
          </div>

          {/* Checkmark Overlay */}
          <div
            ref={checkRef}
            className="absolute inset-0 flex items-center justify-center z-20 opacity-0"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-500/40">
              <CheckCircle className="w-12 h-12 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Text sequence */}
        <h3 className="mb-2 text-lg font-bold text-black transition-all">
          {stepText}
        </h3>
        <p className="max-w-xs text-xs text-red-700">
          Broadcasting priority emergency telemetry across the CrisisConnect community mesh.
        </p>
      </div>
    </div>
  );
};
