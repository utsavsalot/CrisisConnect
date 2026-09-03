import React from 'react';
import { 
  Heart, 
  Pill, 
  Activity, 
  Utensils, 
  Home, 
  Truck, 
  LifeBuoy, 
  Droplets, 
  HelpCircle 
} from 'lucide-react';
import { EmergencyNeedCategory } from '../../types';

interface EmergencyCategoryCardProps {
  category: EmergencyNeedCategory;
  selected: boolean;
  onToggle: (cat: EmergencyNeedCategory) => void;
}

const CATEGORY_CONFIG: Record<EmergencyNeedCategory, { label: string; icon: React.FC<{ className?: string }>; emoji: string; color: string }> = {
  'Blood': { label: 'Blood', icon: Heart, emoji: '🩸', color: 'text-red-400 border-red-500/40 bg-red-500/10' },
  'Medicine': { label: 'Medicine', icon: Pill, emoji: '💊', color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
  'Medical Assistance': { label: 'Medical Assistance', icon: Activity, emoji: '🏥', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
  'Food': { label: 'Food', icon: Utensils, emoji: '🍱', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  'Shelter': { label: 'Shelter', icon: Home, emoji: '🏠', color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10' },
  'Transportation': { label: 'Transportation', icon: Truck, emoji: '🚑', color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
  'Rescue': { label: 'Rescue', icon: LifeBuoy, emoji: '🛟', color: 'text-orange-400 border-orange-500/40 bg-orange-500/10' },
  'Water': { label: 'Water', icon: Droplets, emoji: '💧', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
  'Other': { label: 'Other', icon: HelpCircle, emoji: '✨', color: 'text-slate-300 border-slate-500/40 bg-slate-500/10' },
};

export const EmergencyCategoryCard: React.FC<EmergencyCategoryCardProps> = ({
  category,
  selected,
  onToggle,
}) => {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => onToggle(category)}
      className={`relative p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
        selected
          ? 'border-emergency-500 bg-emergency-500/15 shadow-emergency-glow/30 scale-[1.02]'
          : 'border-white/10 dark:border-white/10 bg-slate-900/40 hover:bg-slate-800/60 hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl" role="img" aria-label={config.label}>
            {config.emoji}
          </span>
          <Icon className={`w-4 h-4 ${selected ? 'text-emergency-400' : 'text-slate-400'}`} />
        </div>
        <div
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
            selected
              ? 'border-emergency-500 bg-emergency-500 text-white'
              : 'border-slate-600 bg-transparent'
          }`}
        >
          {selected && <span className="text-xs font-bold">✓</span>}
        </div>
      </div>
      <span className={`text-xs font-bold tracking-wide ${selected ? 'text-white' : 'text-slate-300'}`}>
        {config.label}
      </span>
    </button>
  );
};
