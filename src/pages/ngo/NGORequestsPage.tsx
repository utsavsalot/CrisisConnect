import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Filter, 
  MapPin, 
  Clock, 
  Shield, 
  ArrowRight, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmergencyNeedCategory } from '../../types';

export const NGORequestsPage: React.FC = () => {
  const { requests, acceptRequest } = useEmergency();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = requests.filter(r => {
    if (selectedCategory !== 'ALL' && !r.needs.includes(selectedCategory as EmergencyNeedCategory)) {
      return false;
    }
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.description.toLowerCase().includes(q) ||
        r.needs.some(n => n.toLowerCase().includes(q)) ||
        (r.location.address && r.location.address.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-theme-light py-8 px-4 sm:px-6 lg:px-8 text-theme-dark">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-mint/30 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-theme-dark font-display">
              EMERGENCY INCIDENT QUEUE
            </h1>
            <p className="text-xs text-theme-forest/80 mt-0.5">
              Live district triage, active emergency filtering, and team dispatch
            </p>
          </div>
          <Link
            to="/ngo/map"
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-theme-dark text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>Map View</span>
          </Link>
        </div>

        {/* Filters Toolbar */}
        <div className="glass-panel rounded-2xl p-4 border border-theme-mint/30 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-theme-forest/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emergency keywords, address..."
              className="w-full bg-white/80 border border-theme-mint/30 rounded-xl pl-9 pr-3 py-2 text-xs text-theme-dark placeholder:text-theme-forest/60 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
            {['ALL', 'Medical Assistance', 'Blood', 'Rescue', 'Food', 'Shelter', 'Transportation'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-theme-dark border-sky-500 shadow-sm'
                    : 'bg-white/5 border-theme-mint/30 text-theme-forest/80 hover:text-theme-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Requests Table / Cards */}
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center border border-theme-mint/30 max-w-md mx-auto">
              <p className="text-xs text-theme-forest/80">No emergency requests match the current filters.</p>
            </div>
          ) : (
            filteredRequests.map((r) => (
              <div
                key={r.id}
                className="glass-panel rounded-2xl p-5 border border-theme-mint/30 hover:border-sky-500/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {r.needs.map(n => (
                      <span
                        key={n}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emergency-500/20 text-emergency-300 border border-emergency-500/30"
                      >
                        {n}
                      </span>
                    ))}
                    <StatusBadge status={r.status} size="sm" />
                    <span className="text-[11px] text-theme-forest/80 font-mono">
                      Ref #{r.id} • {new Date(r.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-theme-dark/90 font-medium leading-relaxed">
                    {r.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-theme-forest/80 mt-2">
                    <div className="flex items-center gap-1.5 text-theme-forest">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{r.location.address || 'Detected Location'}</span>
                    </div>
                    <span className="text-emerald-400 font-mono font-semibold">
                      {r.distanceKm || 1.4} km away
                    </span>
                    <span>Reported by: <strong className="text-theme-dark">{r.requesterName}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-theme-mint/30">
                  <Link
                    to={`/ngo/requests/${r.id}`}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-theme-dark font-semibold text-xs transition-colors"
                  >
                    View Dossier
                  </Link>

                  {r.status === 'active' && (
                    <button
                      onClick={() => acceptRequest(r.id)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-theme-dark font-bold text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Accept & Dispatch</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
