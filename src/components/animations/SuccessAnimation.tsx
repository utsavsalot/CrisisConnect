import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessAnimationProps {
  title?: string;
  subtitle?: string;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  title = 'Assistance Resolved Successfully',
  subtitle = 'Mission logged and verified across community ledger.'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>
      <div>
        <h4 className="text-base font-bold text-white font-display">{title}</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">{subtitle}</p>
      </div>
    </div>
  );
};
