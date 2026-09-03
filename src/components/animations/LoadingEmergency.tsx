import React from 'react';
import { AlertTriangle, Radio } from 'lucide-react';

interface LoadingEmergencyProps {
  message?: string;
}

export const LoadingEmergency: React.FC<LoadingEmergencyProps> = ({
  message = 'Broadcasting priority emergency telemetry...'
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Pulsing beacon rings */}
        <div className="absolute inset-0 rounded-full border border-emergency-500/40 animate-ping" />
        <div className="absolute inset-2 rounded-full border border-emergency-500/30 animate-pulse" />
        <div className="w-12 h-12 rounded-2xl bg-emergency-600/30 border border-emergency-500 flex items-center justify-center text-emergency-500 shadow-emergency-glow">
          <AlertTriangle className="w-6 h-6 animate-bounce" />
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-theme-dark font-display tracking-wide flex items-center justify-center gap-2">
          <Radio className="w-4 h-4 text-emergency-500 animate-pulse" />
          <span>{message}</span>
        </h4>
        <p className="text-[11px] text-theme-forest/80 font-mono">
          COMMUNITY MESH • ACTIVE BROADCAST
        </p>
      </div>
    </div>
  );
};
