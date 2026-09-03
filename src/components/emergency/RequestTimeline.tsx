import React from 'react';
import { CheckCircle2, Circle, Radio, Users, Activity, Flag } from 'lucide-react';
import { EmergencyStatus } from '../../types';

interface RequestTimelineProps {
  status: EmergencyStatus;
}

export const RequestTimeline: React.FC<RequestTimelineProps> = ({ status }) => {
  const steps = [
    { key: 'submitted', label: 'Request Submitted', icon: Radio },
    { key: 'active', label: 'Request Active', icon: Activity },
    { key: 'accepted', label: 'Responder / NGO Accepted', icon: Users },
    { key: 'in_progress', label: 'Assistance In Progress', icon: Activity },
    { key: 'resolved', label: 'Resolved', icon: Flag },
  ];

  const getStepState = (stepKey: string): 'completed' | 'current' | 'pending' => {
    switch (status) {
      case 'active':
        if (stepKey === 'submitted') return 'completed';
        if (stepKey === 'active') return 'current';
        return 'pending';
      case 'accepted':
        if (stepKey === 'submitted' || stepKey === 'active') return 'completed';
        if (stepKey === 'accepted') return 'current';
        return 'pending';
      case 'in_progress':
        if (stepKey === 'submitted' || stepKey === 'active' || stepKey === 'accepted') return 'completed';
        if (stepKey === 'in_progress') return 'current';
        return 'pending';
      case 'resolved':
        return 'completed';
      default:
        return 'pending';
    }
  };

  return (
    <div className="w-full py-4">
      {/* Desktop Horizontal Stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 -z-0" />

        {steps.map((step, idx) => {
          const state = getStepState(step.key);
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10 text-center px-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  state === 'completed'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                    : state === 'current'
                    ? 'bg-emergency-500/20 border-emergency-500 text-emergency-400 shadow-emergency-glow scale-110 animate-pulse'
                    : 'bg-slate-900 border-white/15 text-slate-500'
                }`}
              >
                {state === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-[11px] font-bold mt-2 max-w-[90px] leading-tight ${
                  state === 'completed'
                    ? 'text-emerald-400'
                    : state === 'current'
                    ? 'text-emergency-400 font-extrabold'
                    : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="sm:hidden space-y-4 relative pl-6 border-l-2 border-white/10 ml-2">
        {steps.map((step) => {
          const state = getStepState(step.key);
          const Icon = step.icon;
          return (
            <div key={step.key} className="relative flex items-center gap-3">
              <div
                className={`absolute -left-[31px] w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                  state === 'completed'
                    ? 'bg-emerald-500 border-emerald-400 text-white'
                    : state === 'current'
                    ? 'bg-emergency-500 border-emergency-400 text-white animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-slate-600'
                }`}
              >
                {state === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3 h-3" />}
              </div>
              <span
                className={`text-xs font-semibold ${
                  state === 'completed'
                    ? 'text-emerald-400'
                    : state === 'current'
                    ? 'text-emergency-400 font-bold'
                    : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
