import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Heart, 
  Activity, 
  LifeBuoy, 
  Truck, 
  Building2, 
  Users, 
  ArrowRight,
  Radio,
  AlertTriangle
} from 'lucide-react';
import { CrisisCharacter } from '../../types';

const EMERGENCY_CHARACTERS: CrisisCharacter[] = [
  {
    id: 'char-1',
    name: 'Citizen Requester',
    roleTitle: 'Emergency Requester',
    ghostWord: 'HELP',
    tagline: 'When every second counts and immediate assistance is vital.',
    description: 'Instant zero-barrier emergency requests broadcast to community responders and humanitarian NGOs within seconds.',
    color: '#EF4444',
    stats: 'Avg. response connection: < 3.2 mins',
    iconName: 'Heart'
  },
  {
    id: 'char-2',
    name: 'Dr. Sarah Chen',
    roleTitle: 'Medical Responder',
    ghostWord: 'CARE',
    tagline: 'Rapid on-site triage and essential medication delivery.',
    description: 'Verified physicians and nurses mobilizing emergency first-aid kits and asthma/insulin supplies directly to individuals in distress.',
    color: '#38BDF8',
    stats: '1,420+ medical interventions coordinated',
    iconName: 'Activity'
  },
  {
    id: 'char-3',
    name: 'Captain Marcus Ruiz',
    roleTitle: 'Search & Rescue Specialist',
    ghostWord: 'RESCUE',
    tagline: 'Specialized extraction and water hazard evacuation.',
    description: 'Equipped for rapid water-borne extractions, structural collapse clearances, and high-water vehicle transport during localized disasters.',
    color: '#F97316',
    stats: '100% active incident coverage',
    iconName: 'LifeBuoy'
  },
  {
    id: 'char-4',
    name: 'Director Eleanor Vance',
    roleTitle: 'NGO Operations Coordinator',
    ghostWord: 'CONNECT',
    tagline: 'Mass resource dispatch and incident command triage.',
    description: 'Overseeing live multi-district emergency map telemetry, ambulance routing, shelter bed allocations, and wholesale blood inventory.',
    color: '#22D3EE',
    stats: '48 partner NGOs networked in real-time',
    iconName: 'Building2'
  },
  {
    id: 'char-5',
    name: 'Maya Lin',
    roleTitle: 'Blood Responder',
    ghostWord: 'RESPOND',
    tagline: 'On-demand rare blood donor and rapid courier.',
    description: 'Direct dispatch for critical O-Negative and plasma emergencies, bridging clinic trauma stabilization with verified donor units.',
    color: '#F43F5E',
    stats: '340+ units transferred safely',
    iconName: 'Heart'
  },
  {
    id: 'char-6',
    name: 'Carlos Mendez',
    roleTitle: 'Transportation Responder',
    ghostWord: 'SUPPORT',
    tagline: 'Accessible transit and high-clearance evacuation.',
    description: 'Drivers with wheelchair-equipped and 4x4 vehicles moving vulnerable elders, children, and medical equipment out of danger zones.',
    color: '#A855F7',
    stats: '12-minute median pickup radius',
    iconName: 'Truck'
  },
  {
    id: 'char-7',
    name: 'Elena Rostova',
    roleTitle: 'Community Assistance Responder',
    ghostWord: 'CARE',
    tagline: 'Thermal shelter and warm nutrition supply.',
    description: 'Deploying high-calorie rations, infant formula, clean potable water, and emergency blankets to displaced residential blocks.',
    color: '#EAB308',
    stats: '8,900+ community meals delivered',
    iconName: 'Users'
  },
  {
    id: 'char-8',
    name: 'Liam Davies',
    roleTitle: 'Critical Care Paramedic',
    ghostWord: 'RESCUE',
    tagline: 'Advance life support and cardiac stabilization.',
    description: 'Equipped with defibrillators, oxygen tanks, and trauma tourniquets, delivering hospital-grade stabilization prior to ambulance transit.',
    color: '#10B981',
    stats: 'Paramedic-grade protocol compliance',
    iconName: 'Shield'
  }
];

export const CharacterCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const activeChar = EMERGENCY_CHARACTERS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % EMERGENCY_CHARACTERS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + EMERGENCY_CHARACTERS.length) % EMERGENCY_CHARACTERS.length);
  };

  useEffect(() => {
    // Animate ghost word
    if (ghostRef.current) {
      gsap.fromTo(
        ghostRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 0.05, scale: 1, y: 0, duration: 0.65, ease: 'power3.out' }
      );
    }

    // Animate stage cards
    if (stageRef.current) {
      const cards = stageRef.current.querySelectorAll('.carousel-card');
      cards.forEach((card, i) => {
        const offset = (i - currentIndex + EMERGENCY_CHARACTERS.length) % EMERGENCY_CHARACTERS.length;
        let xPos = 0;
        let scale = 1;
        let opacity = 1;
        let zIndex = 30;
        let filter = 'blur(0px)';
        let rotateY = 0;

        if (offset === 0) {
          // Center
          xPos = 0;
          scale = 1.08;
          opacity = 1;
          zIndex = 30;
          filter = 'blur(0px)';
          rotateY = 0;
        } else if (offset === 1 || offset === -EMERGENCY_CHARACTERS.length + 1) {
          // Right 1
          xPos = 240;
          scale = 0.85;
          opacity = 0.55;
          zIndex = 20;
          filter = 'blur(2px)';
          rotateY = -18;
        } else if (offset === EMERGENCY_CHARACTERS.length - 1 || offset === -1) {
          // Left 1
          xPos = -240;
          scale = 0.85;
          opacity = 0.55;
          zIndex = 20;
          filter = 'blur(2px)';
          rotateY = 18;
        } else if (offset === 2) {
          // Far right
          xPos = 420;
          scale = 0.68;
          opacity = 0.2;
          zIndex = 10;
          filter = 'blur(4px)';
          rotateY = -28;
        } else if (offset === EMERGENCY_CHARACTERS.length - 2) {
          // Far left
          xPos = -420;
          scale = 0.68;
          opacity = 0.2;
          zIndex = 10;
          filter = 'blur(4px)';
          rotateY = 28;
        } else {
          // Hidden in back
          xPos = 0;
          scale = 0.5;
          opacity = 0;
          zIndex = 0;
          filter = 'blur(8px)';
          rotateY = 0;
        }

        gsap.to(card, {
          x: xPos,
          scale,
          opacity,
          zIndex,
          filter,
          rotationY: rotateY,
          duration: 0.65,
          ease: 'power3.out'
        });
      });
    }
  }, [currentIndex]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-theme-dark select-none"
    >
      {/* Background Tech Network Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radar concentric circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-sky-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-sky-500/5" />
        
        {/* Radar beam line */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-emergency-500/10 radar-sweep" />


      </div>

      {/* Huge Ghost Typography Behind Stage */}
      <div
        ref={ghostRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none -z-0"
      >
        <span className="text-[18vw] font-black tracking-tighter text-theme-light/5 uppercase font-display select-none">
          {activeChar.ghostWord}
        </span>
      </div>

      {/* Hero Intent & Primary Emergency CTA */}
      <div className="relative z-30 pt-6 sm:pt-8 px-4 text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-dark/95 border border-emergency-500/40 text-xs font-semibold text-emergency-400 mb-2.5 backdrop-blur-xl shadow-lg shadow-black/50">
          <span className="w-2 h-2 rounded-full bg-emergency-500 animate-ping" />
          <span>Need emergency help? Get connected to a nearby responder in seconds.</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/request-help"
            className="px-4 py-2 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emergency-600/25 transition-all active:scale-95 border border-emergency-400/30"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
            <span>Request Help</span>
          </Link>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-theme-forest/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Nearby responders ready to help</span>
          </div>
        </div>
      </div>

      {/* Main 3D Carousel Stage */}
      <div className="flex-1 flex items-center justify-center relative z-20 py-4 sm:py-6 perspective-1000">
        <div
          ref={stageRef}
          className="relative w-72 sm:w-80 h-[380px] sm:h-[440px] flex items-center justify-center"
          style={{ perspective: '1000px' }}
        >
          {EMERGENCY_CHARACTERS.map((char, index) => {
            const isCenter = index === currentIndex;
            return (
              <div
                key={char.id}
                className="carousel-card absolute inset-0 rounded-3xl glass-panel p-6 sm:p-7 flex flex-col justify-between border border-theme-mint/40 backdrop-blur-2xl shadow-2xl cursor-pointer transition-colors"
                onClick={() => setCurrentIndex(index)}
                style={{
                  background: isCenter
                    ? `radial-gradient(circle at 50% 0%, ${char.color}18, rgba(30, 43, 34, 0.95) 75%)`
                    : 'rgba(30, 43, 34, 0.85)',
                  boxShadow: isCenter ? `0 20px 50px -10px ${char.color}35` : 'none'
                }}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: char.color }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-theme-forest/80">
                      {char.roleTitle}
                    </span>
                  </div>
                  <Radio className="w-4 h-4 text-theme-forest/60 animate-pulse" />
                </div>

                {/* Central Figurine Concept Visual */}
                <div className="flex-1 flex flex-col items-center justify-center my-4">
                  <div
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center border-2 shadow-inner relative group"
                    style={{
                      borderColor: char.color,
                      backgroundColor: `${char.color}15`
                    }}
                  >
                    <div className="absolute inset-2 rounded-full border border-dashed border-theme-mint/40 animate-spin" style={{ animationDuration: '24s' }} />
                    <Shield className="w-14 h-14 sm:w-16 sm:h-16 transition-transform group-hover:scale-110" style={{ color: char.color }} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-4 font-display text-center">
                    {char.name}
                  </h3>
                </div>


              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Bottom Bar: Dynamic Narrative + Controls + CTAs */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-theme-mint/30 bg-theme-dark/70 backdrop-blur-xl">
        
        {/* Dynamic Character Description */}
        <div className="max-w-xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emergency-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-widest text-theme-forest/80">
              {activeChar.roleTitle} Network
            </span>
          </div>
          <p className="text-base sm:text-lg font-semibold text-white leading-snug">
            "{activeChar.tagline}"
          </p>
          <p className="text-xs text-theme-forest/80 mt-1 leading-relaxed">
            {activeChar.description}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 md:mr-28">
          <button
            onClick={handlePrev}
            aria-label="Previous character"
            className="p-3 rounded-xl border border-theme-mint/40 bg-white/5 hover:bg-white/15 text-white transition-all transform active:scale-95 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next character"
            className="p-3 rounded-xl border border-theme-mint/40 bg-white/5 hover:bg-white/15 text-white transition-all transform active:scale-95 shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

    </section>
  );
};
