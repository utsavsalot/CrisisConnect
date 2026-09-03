import React from 'react';
import { Wifi, Users, Shield } from 'lucide-react';

interface LoadingConnectionProps {
  message?: string;
}

export const LoadingConnection: React.FC<LoadingConnectionProps> = ({
  message = 'Scanning verified responders in radius...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping" />
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
          <Wifi className="w-5 h-5 animate-pulse" />
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-bold text-white">{message}</p>
        <p className="text-[10px] text-slate-400 font-mono">
          CHECKING MEDICAL & RESCUE CAPABILITIES
        </p>
      </div>
    </div>
  );
};
