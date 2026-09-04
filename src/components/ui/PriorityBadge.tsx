import React from 'react';
import { CrisisPriority } from '../../types';
import { AlertTriangle, Flame, ShieldAlert, Activity } from 'lucide-react';

interface PriorityBadgeProps {
  level?: CrisisPriority;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  className?: string;
}

const config = {
  critical: {
    color: 'bg-red-500/10 border-red-500 text-red-600',
    icon: Flame,
    label: 'CRITICAL',
    bg: 'bg-red-600'
  },
  high: {
    color: 'bg-orange-500/10 border-orange-500 text-orange-600',
    icon: AlertTriangle,
    label: 'HIGH',
    bg: 'bg-orange-500'
  },
  medium: {
    color: 'bg-amber-500/10 border-amber-500 text-amber-600',
    icon: ShieldAlert,
    label: 'MEDIUM',
    bg: 'bg-amber-500'
  },
  normal: {
    color: 'bg-emerald-500/10 border-emerald-500 text-emerald-600',
    icon: Activity,
    label: 'NORMAL',
    bg: 'bg-emerald-500'
  }
};

const sizes = {
  sm: 'text-[9px] px-1.5 py-0.5 gap-1',
  md: 'text-[11px] px-2.5 py-1 gap-1.5',
  lg: 'text-xs px-3 py-1.5 gap-2'
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ 
  level = 'normal', 
  score = 0, 
  size = 'md',
  showScore = true,
  className = ''
}) => {
  const current = config[level] || config.normal;
  const Icon = current.icon;

  return (
    <div className={`inline-flex items-center font-black uppercase tracking-wider rounded-full border ${current.color} ${sizes[size]} ${className}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
      {showScore && (
        <span className={`ml-1 px-1.5 rounded-full text-white ${current.bg}`}>
          {score}
        </span>
      )}
    </div>
  );
};
