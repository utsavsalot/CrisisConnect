import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { 
  AlertTriangle, 
  MapPin, 
  Radio, 
  Users, 
  CheckCircle, 
  Heart, 
  ArrowRight,
  ShieldCheck,
  MousePointer
} from 'lucide-react';

interface StoryFrame {
  id: number;
  label: string;
  title: string;
  desc: string;
  tag: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  color: string;
}

const STORY_FRAMES: StoryFrame[] = [
  {
    id: 1,
    label: '01 / INITIATION',
    title: 'Someone Needs Help',
    desc: 'An acute emergency occurs. A citizen is unable to breathe, displaced by localized flooding, or requires critical rare medicine.',
    tag: 'CRISIS EMERGES',
    icon: AlertTriangle,
    color: '#EF4444'
  },
  {
    id: 2,
    label: '02 / BROADCAST',
    title: 'Emergency Request Created',
    desc: 'In seconds, the requester taps Request Help, selects needed resources, and submits zero-friction triage telemetry.',
    tag: 'TELEMETRY DISPATCH',
    icon: Radio,
    color: '#F97316'
  },
  {
    id: 3,
    label: '03 / TRIANGULATION',
    title: 'Location Detected',
    desc: 'Browser GPS locks coordinates to sub-meter accuracy, identifying nearby hazard proximity and municipal response sectors.',
    tag: 'GPS LOCKED',
    icon: MapPin,
    color: '#38BDF8'
  },
  {
    id: 4,
    label: '04 / MESH DISPATCH',
    title: 'Responders & NGOs Alerted',
    desc: 'The CrisisConnect real-time mesh instantly pings verified community responders within 3 km and activates the NGO incident desk.',
    tag: 'RADIUS ALERT',
    icon: Users,
    color: '#22D3EE'
  },
  {
    id: 5,
    label: '05 / COMMITMENT',
    title: 'Assistance Accepted',
    desc: 'A nearby doctor, rescue driver, or humanitarian team accepts the mission, establishing private real-time coordination.',
    tag: 'MISSION ACCEPTED',
    icon: ShieldCheck,
    color: '#10B981'
  },
  {
    id: 6,
    label: '06 / DEPLOYMENT',
    title: 'Help Is On The Way',
    desc: 'Encrypted direct chat opens, real-time dispatch progress updates, and supplies are brought straight to the requester’s door.',
    tag: 'EN ROUTE',
    icon: Heart,
    color: '#A855F7'
  },
  {
    id: 7,
    label: '07 / RESOLUTION',
    title: 'Assistance Completed',
    desc: 'Triage is performed, medical stabilization or evacuation is verified, and the request closes cleanly as Resolved.',
    tag: 'MISSION RESOLVED',
    icon: CheckCircle,
    color: '#22C55E'
  }
];

export const VideoScrubber: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const normalized = x / rect.width;
    
    setProgress(normalized);

    const frameIdx = Math.min(
      Math.floor(normalized * STORY_FRAMES.length),
      STORY_FRAMES.length - 1
    );
    setActiveFrameIndex(frameIdx);

    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${normalized * 100}%`,
        duration: 0.1,
        ease: 'none'
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const normalized = x / rect.width;
    
    setProgress(normalized);

    const frameIdx = Math.min(
      Math.floor(normalized * STORY_FRAMES.length),
      STORY_FRAMES.length - 1
    );
    setActiveFrameIndex(frameIdx);

    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${normalized * 100}%`,
        duration: 0.1,
        ease: 'none'
      });
    }
  };

  const currentFrame = STORY_FRAMES[activeFrameIndex];
  const Icon = currentFrame.icon;

  return (
    <section
      id="storyboard"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative min-h-[85vh] bg-[#0B1020] border-t border-b border-theme-mint/30 flex flex-col justify-between py-16 px-4 sm:px-8 cursor-crosshair overflow-hidden select-none"
    >
      {/* Background Ambience based on active frame color */}
      <div
        className="absolute inset-0 transition-all duration-700 pointer-events-none opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle at ${progress * 100}% 50%, ${currentFrame.color}, transparent 60%)`
        }}
      />

      {/* Header */}
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-theme-mint/30 text-xs font-mono text-theme-forest/80 mb-4">
          <MousePointer className="w-3.5 h-3.5 text-tech-blue animate-bounce" />
          <span>MOVE YOUR CURSOR HORIZONTALLY TO SCRUB THE RESPONSE STORY</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-theme-dark tracking-tight font-display">
          HELP SHOULD NEVER FEEL FAR AWAY.
        </h2>
        <p className="text-sm sm:text-base text-theme-forest/80 mt-3 max-w-2xl mx-auto">
          See how one urgent request mobilizes an entire community response in real time.
        </p>
      </div>

      {/* Dynamic Storyboard Frame Display */}
      <div className="max-w-4xl mx-auto w-full my-8 relative z-10">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-theme-mint/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-all duration-300">
          
          {/* Top Tag & Frame Counter */}
          <div className="flex items-center justify-between border-b border-theme-mint/30 pb-4 mb-6">
            <span className="text-xs font-mono font-bold tracking-widest text-theme-forest/80">
              {currentFrame.label}
            </span>
            <span
              className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border"
              style={{
                borderColor: `${currentFrame.color}40`,
                backgroundColor: `${currentFrame.color}15`,
                color: currentFrame.color
              }}
            >
              {currentFrame.tag}
            </span>
          </div>

          {/* Central Frame Content */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <div
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center border-2 shrink-0 transition-transform duration-300 transform scale-105"
              style={{
                borderColor: currentFrame.color,
                backgroundColor: `${currentFrame.color}20`,
                boxShadow: `0 0 30px ${currentFrame.color}30`
              }}
            >
              <Icon className="w-12 h-12 sm:w-16 sm:h-16" style={{ color: currentFrame.color }} />
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-theme-dark font-display">
                {currentFrame.title}
              </h3>
              <p className="text-sm sm:text-base text-theme-forest mt-3 leading-relaxed">
                {currentFrame.desc}
              </p>
            </div>
          </div>

          {/* Storyboard 7-Step Dots Track */}
          <div className="grid grid-cols-7 gap-2 mt-8 pt-6 border-t border-theme-mint/30">
            {STORY_FRAMES.map((f, i) => (
              <div
                key={f.id}
                onClick={() => {
                  setActiveFrameIndex(i);
                  setProgress(i / (STORY_FRAMES.length - 1));
                }}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  i <= activeFrameIndex ? 'bg-white' : 'bg-white/20'
                }`}
                style={{
                  backgroundColor: i <= activeFrameIndex ? currentFrame.color : undefined
                }}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Scrubbing Bar & Hint Footer */}
      <div className="max-w-4xl mx-auto w-full relative z-10">
        <div className="flex items-center justify-between text-xs text-theme-forest/80 mb-2 font-mono">
          <span>01. EMERGENCY</span>
          <span className="flex items-center gap-1 text-theme-dark font-bold tracking-wider">
            <span>MOVE TO CONNECT</span>
            <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
          </span>
          <span>07. RESOLUTION</span>
        </div>

        {/* Interactive Scrub Track */}
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden relative cursor-pointer border border-theme-mint/30">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-emergency-500 via-sky-400 to-emerald-400 transition-all duration-75"
            style={{ width: `${(activeFrameIndex / (STORY_FRAMES.length - 1)) * 100}%` }}
          />
        </div>
      </div>

    </section>
  );
};
