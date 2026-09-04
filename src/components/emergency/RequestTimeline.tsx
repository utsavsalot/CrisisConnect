import React from 'react';
import { CheckCircle2, Radio, Users, Activity, Flag } from 'lucide-react';
import { EmergencyStatus } from '../../types';

interface RequestTimelineProps { status: EmergencyStatus; }

const steps = [
  { key: 'submitted', label: 'Request Submitted', icon: Radio },
  { key: 'active', label: 'Request Active', icon: Activity },
  { key: 'accepted', label: 'Responder / NGO Accepted', icon: Users },
  { key: 'in_progress', label: 'Assistance In Progress', icon: Activity },
  { key: 'resolved', label: 'Resolved', icon: Flag },
];

const statusIndex: Record<EmergencyStatus, number> = { active: 1, accepted: 2, in_progress: 3, resolved: 4, admin_escalated: 1 };

export const RequestTimeline: React.FC<RequestTimelineProps> = ({ status }) => {
  const currentIndex = statusIndex[status];
  return (
    <div className="w-full py-4">
      <div className="relative hidden items-start justify-between sm:flex">
        <div className="absolute left-6 right-6 top-5 h-0.5 bg-slate-200" />
        <div className="absolute left-6 top-5 h-0.5 bg-emerald-400 transition-all duration-500" style={{ width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 12px)` }} />
        {steps.map((step, index) => {
          const reached = index <= currentIndex;
          const current = index === currentIndex && status !== 'resolved';
          const Icon = step.icon;
          return <div key={step.key} className="relative z-10 flex w-1/5 flex-col items-center px-2 text-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${reached ? 'border-emerald-400 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-white text-slate-400'} ${current ? 'ring-4 ring-emerald-100' : ''}`}>
              {reached ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
            </div>
            <span className={`mt-2 max-w-[100px] text-[11px] font-bold leading-tight ${reached ? 'text-emerald-600' : 'text-slate-400'}`}>{step.label}</span>
          </div>;
        })}
      </div>
      <div className="relative ml-2 space-y-4 border-l-2 border-slate-200 pl-6 sm:hidden">
        {steps.map((step, index) => {
          const reached = index <= currentIndex;
          const current = index === currentIndex && status !== 'resolved';
          const Icon = step.icon;
          return <div key={step.key} className="relative flex items-center gap-3">
            <div className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border ${reached ? 'border-emerald-400 bg-emerald-50 text-emerald-600' : 'border-slate-200 bg-white text-slate-400'} ${current ? 'ring-2 ring-emerald-100' : ''}`}>
              {reached ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3 w-3" />}
            </div>
            <span className={`text-xs font-semibold ${reached ? 'text-emerald-600' : 'text-slate-400'}`}>{step.label}</span>
          </div>;
        })}
      </div>
    </div>
  );
};