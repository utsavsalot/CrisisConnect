import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Shield, 
  Activity, 
  MapPin, 
  Navigation,
  Database
} from 'lucide-react';

/**
 * 1. RequesterMotionWidget
 * Story: REQUEST → GPS LOCK → BROADCAST
 * Cycles through emergency supply chips and displays a live simulated mesh broadcast.
 */
export const RequesterMotionWidget: React.FC = () => {
  const [activeChip, setActiveChip] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveChip((prev) => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const chips = [
    { label: '🩸 Rare Blood (O-)', type: 'Medical' },
    { label: '💊 Emergency Insulin', type: 'Supplies' },
    { label: '🚙 Flood Evacuation', type: 'Rescue' }
  ];

  return (
    <div className="h-[185px] w-full rounded-2xl bg-theme-light/90 border border-emergency-500/20 p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-inner select-none">
      {/* Top Status: GPS Lock & Demo Label */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
          <span className="font-semibold tracking-wider">GPS: LOCKED (HIGH-PRECISION)</span>
        </div>
        <span className="text-[9px] text-theme-forest/60 font-semibold tracking-wider uppercase">
          SIMULATED TELEMETRY
        </span>
      </div>

      {/* Middle: Interactive-style Need Selector Chips */}
      <div className="space-y-1.5 my-auto">
        <div className="text-[10px] text-theme-forest/80 font-mono uppercase tracking-wider flex items-center gap-1">
          <span>Selected Emergency Needs:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip, idx) => {
            const isActive = idx === activeChip;
            return (
              <div
                key={chip.label}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emergency-500/20 border border-emergency-500/60 text-emergency-300 shadow-sm shadow-emergency-500/20 scale-[1.02]'
                    : 'bg-white/5 border border-theme-mint/30 text-theme-forest/80'
                }`}
              >
                <span>{chip.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emergency-400 animate-ping motion-reduce:animate-none" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: Transmission Wave Status */}
      <div className="pt-2 border-t border-theme-mint/30 flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-2 text-emergency-400">
          <Radio className="w-3.5 h-3.5 animate-pulse motion-reduce:animate-none" />
          <span className="truncate">Broadcasting signal across local mesh...</span>
        </div>
        <span className="text-theme-forest/60 text-[9px] shrink-0 font-bold">1-TAP DISPATCH</span>
      </div>
    </div>
  );
};

/**
 * 2. ResponderMotionWidget
 * Story: INCOMING ALERT → REVIEW → ACCEPT → ROUTE UNLOCKED
 * Clean 3-stage mission lifecycle progress without chaotic countdowns.
 */
export const ResponderMotionWidget: React.FC = () => {
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const stages = [
    { label: 'Alert', desc: 'Incoming Alert: Medical Aid', icon: Activity, tag: '400m Away' },
    { label: 'Accept', desc: 'Accepting Task Assignment...', icon: Shield, tag: 'Matched Role' },
    { label: 'Route', desc: 'Route Unlocked • Navigating', icon: Navigation, tag: 'Live GPS' }
  ];

  const current = stages[stage];
  const CurrentIcon = current.icon;

  return (
    <div className="h-[185px] w-full rounded-2xl bg-theme-light/90 border border-emerald-500/20 p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-inner select-none">
      {/* Top Status */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
          <span className="font-semibold tracking-wider">STANDBY MODE: ACTIVE</span>
        </div>
        <span className="text-[9px] text-theme-forest/60 font-semibold tracking-wider uppercase">
          SIMULATED WORKFLOW
        </span>
      </div>

      {/* Middle: Active Mission Phase Card */}
      <div className="my-auto p-2.5 rounded-xl bg-white/[0.04] border border-emerald-500/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CurrentIcon className="w-4 h-4 transition-transform duration-300" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-theme-dark truncate font-display">
              {current.desc}
            </p>
            <p className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
              Protocol Stage: {current.label.toUpperCase()}
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono font-bold text-emerald-300 shrink-0">
          {current.tag}
        </span>
      </div>

      {/* Bottom: 3-Step Lifecycle Indicator */}
      <div className="pt-2 border-t border-theme-mint/30 flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-3">
          {stages.map((s, idx) => (
            <div key={s.label} className="flex items-center gap-1">
              <span 
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  idx === stage ? 'bg-emerald-400 ring-2 ring-emerald-400/30' : 'bg-slate-600'
                }`} 
              />
              <span className={idx === stage ? 'text-emerald-300 font-bold' : 'text-theme-forest/60'}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <span className="text-theme-forest/60 text-[9px] font-bold">DISPATCH CYCLE</span>
      </div>
    </div>
  );
};

/**
 * 3. NGOMotionWidget
 * Story: INCIDENT MONITORING → RESOURCE STATUS → COORDINATION
 * Shows simulated multi-resource telemetry meters and inventory health.
 */
export const NGOMotionWidget: React.FC = () => {
  const [pulseIndex, setPulseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const resources = [
    { label: 'Rare Blood Bank', pct: 82, color: 'bg-emergency-500' },
    { label: 'Emergency Trauma Kits', pct: 94, color: 'bg-sky-400' },
    { label: 'Evacuation Shelter Beds', pct: 64, color: 'bg-emerald-400' }
  ];

  return (
    <div className="h-[185px] w-full rounded-2xl bg-theme-light/90 border border-sky-500/20 p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-inner select-none">
      {/* Top Status */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-sky-400">
          <Database className="w-3 h-3 animate-pulse motion-reduce:animate-none" />
          <span className="font-semibold tracking-wider">COMMAND TELEMETRY</span>
        </div>
        <span className="text-[9px] text-theme-forest/60 font-semibold tracking-wider uppercase">
          SAMPLE INVENTORY
        </span>
      </div>

      {/* Middle: Resource Capacity Bars */}
      <div className="space-y-2 my-auto">
        {resources.map((res, i) => (
          <div key={res.label} className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className={i === pulseIndex ? 'text-sky-300 font-semibold' : 'text-theme-forest/80'}>
                {res.label}
              </span>
              <span className="text-theme-forest/80 font-bold">{res.pct}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full ${res.color} transition-all duration-700 motion-reduce:duration-0`}
                style={{ width: `${res.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: Coordinated Sector Status */}
      <div className="pt-2 border-t border-theme-mint/30 flex items-center justify-between text-[10px] font-mono">
        <div className="flex items-center gap-1.5 text-sky-400">
          <MapPin className="w-3 h-3" />
          <span>Multi-sector inventory & dispatch</span>
        </div>
        <span className="text-theme-forest/60 text-[9px] font-bold">INCIDENT HQ</span>
      </div>
    </div>
  );
};
