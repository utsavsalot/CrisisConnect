import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { EmergencyRequest } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

interface RequestCardProps {
  request: EmergencyRequest;
  onAccept?: (id: string) => void;
  showAcceptAction?: boolean;
  baseLink?: string;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onAccept,
  showAcceptAction = false,
  baseLink = '/requests',
}) => {
  // Format request age cleanly (e.g. "2 min ago")
  const getAge = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const mins = Math.max(1, Math.floor(diffMs / 60000));
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  };

  const isActive = request.status === 'active';

  return (
    <div
      className={`relative rounded-2xl glass-panel p-5 border transition-all duration-200 overflow-hidden group ${
        isActive
          ? 'border-emergency-500/40 hover:border-emergency-500/70 shadow-emergency-glow/10'
          : 'border-theme-mint/30 hover:border-theme-mint/40'
      }`}
    >
      {/* Subtle pulsing red accent edge for active emergency requests */}
      {isActive && (
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-emergency-500 to-rose-600 animate-pulse" />
      )}

      {/* Top Bar: Needs + Age + Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {request.needs.map((need) => (
            <span
              key={need}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emergency-500/15 text-emergency-300 border border-emergency-500/30"
            >
              {need}
            </span>
          ))}
          {request.otherNeed && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-theme-sage text-theme-forest border border-slate-700">
              +{request.otherNeed}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] text-theme-forest/80 font-mono">
            <Clock className="w-3 h-3" />
            {getAge(request.createdAt)}
          </span>
          <StatusBadge status={request.status} size="sm" />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm font-medium text-theme-dark mb-3 line-clamp-2 leading-relaxed">
        {request.description}
      </p>

      {/* Location & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-theme-mint/20 text-xs text-theme-forest/80">
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="truncate max-w-[200px] sm:max-w-xs text-theme-forest">
            {request.location.address || `${request.location.latitude.toFixed(3)}, ${request.location.longitude.toFixed(3)}`}
          </span>
          {typeof request.distanceKm === 'number' && (
            <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 font-mono text-[10px] shrink-0">
              {request.distanceKm} km away
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {showAcceptAction && isActive && onAccept && (
            <button
              onClick={() => onAccept(request.id)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-theme-dark font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Accept</span>
            </button>
          )}

          <Link
            to={`${baseLink}/${request.id}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-theme-dark/90 text-xs font-semibold transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
