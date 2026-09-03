import React from 'react';
import { EmergencyStatus } from '../../types';

interface StatusBadgeProps {
  status: EmergencyStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          label: 'ACTIVE',
          badgeClass: 'bg-emergency-500/15 text-emergency-400 border-emergency-500/30',
          dotClass: 'bg-emergency-500 animate-ping',
          staticDot: 'bg-emergency-500'
        };
      case 'accepted':
        return {
          label: 'ACCEPTED',
          badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
          dotClass: 'bg-sky-400',
          staticDot: 'bg-sky-400'
        };
      case 'in_progress':
        return {
          label: 'IN PROGRESS',
          badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          dotClass: 'bg-amber-400 animate-pulse',
          staticDot: 'bg-amber-400'
        };
      case 'resolved':
        return {
          label: 'RESOLVED',
          badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dotClass: 'bg-emerald-400',
          staticDot: 'bg-emerald-400'
        };
      default:
        return {
          label: status,
          badgeClass: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
          dotClass: 'bg-slate-400',
          staticDot: 'bg-slate-400'
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold tracking-wider uppercase backdrop-blur-md ${config.badgeClass} ${sizeClasses[size]}`}
    >
      <span className="relative flex h-2 w-2">
        {status === 'active' && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotClass}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.staticDot}`} />
      </span>
      <span>{config.label}</span>
    </span>
  );
};
