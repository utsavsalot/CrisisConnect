import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Shield } from 'lucide-react';
import { EmergencyRequest } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

interface RequestCardProps {
  request: EmergencyRequest;
  onAccept?: (id: string) => void;
  showAcceptAction?: boolean;
  baseLink?: string;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onAccept, showAcceptAction = false, baseLink = '/requests' }) => {
  const getAge = (isoString: string) => {
    const mins = Math.max(1, Math.floor((Date.now() - new Date(isoString).getTime()) / 60000));
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  };

  const isActive = request.status === 'active';

  return (
    <div className={`group relative overflow-hidden rounded-2xl border bg-[#fffdf8] p-5 text-slate-900 shadow-[0_14px_32px_rgba(127,29,29,0.12)] transition-all duration-200 ${isActive ? 'border-red-300 hover:border-red-500 hover:shadow-[0_18px_38px_rgba(127,29,29,0.18)]' : 'border-red-100 hover:border-red-300 hover:shadow-[0_18px_38px_rgba(127,29,29,0.16)]'}`}>
      {isActive && <div className="absolute bottom-0 left-0 top-0 w-1 animate-pulse bg-red-600" />}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {request.needs.map((need) => <span key={need} className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700">{need}</span>)}
          {request.otherNeed && <span className="rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">+{request.otherNeed}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500"><Clock className="h-3 w-3" />{getAge(request.createdAt)}</span>
          <StatusBadge status={request.status} size="sm" />
        </div>
      </div>

      <p className="mb-3 line-clamp-2 text-sm font-medium leading-relaxed text-slate-900">{request.description}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-red-100 pt-3 text-xs text-slate-600">
        <div className="flex min-w-0 items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-red-600" />
          <span className="max-w-[200px] truncate text-slate-700 sm:max-w-xs">{request.location.address || `${request.location.latitude.toFixed(3)}, ${request.location.longitude.toFixed(3)}`}</span>
          {typeof request.distanceKm === 'number' && <span className="shrink-0 rounded bg-red-50 px-1.5 py-0.5 font-mono text-[10px] text-red-700">{request.distanceKm} km away</span>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {showAcceptAction && isActive && onAccept && <button onClick={() => onAccept(request.id)} className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-transform hover:bg-red-700 active:scale-95"><Shield className="h-3.5 w-3.5" /><span>Accept</span></button>}
          <Link to={`${baseLink}/${request.id}`} className="flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"><span>Details</span><ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></Link>
        </div>
      </div>
    </div>
  );
};