import React from 'react';
import { MapPin, RefreshCw } from 'lucide-react';

interface LoadingLocationProps {
  message?: string;
}

export const LoadingLocation: React.FC<LoadingLocationProps> = ({
  message = 'Detecting sub-meter GPS coordinates...'
}) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs">
      <div className="relative w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
        <MapPin className="w-4 h-4 animate-bounce" />
        <span className="absolute inset-0 rounded-lg border border-sky-400 animate-ping opacity-50" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-theme-dark flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3 animate-spin text-sky-400" />
          <span>{message}</span>
        </div>
        <p className="text-[10px] text-sky-300 font-mono">
          TRIANGULATING RADIUS NODES...
        </p>
      </div>
    </div>
  );
};
