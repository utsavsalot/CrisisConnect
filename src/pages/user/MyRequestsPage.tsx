import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Clock, MapPin, Plus, Filter } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { RequestCard } from '../../components/emergency/RequestCard';
import { EmergencyStatus } from '../../types';

export const MyRequestsPage: React.FC = () => {
  const { myRequests } = useEmergency();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredRequests = myRequests.filter(r => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-theme-light py-8 px-4 sm:px-6 lg:px-8 text-theme-dark">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-mint/30 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-theme-forest/80">
                Incident History
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-theme-dark font-display mt-1">
              My Emergency Requests
            </h1>
            <p className="text-xs text-theme-forest/80 mt-0.5">
              Live status tracking, assigned responders, and coordination logs
            </p>
          </div>

          <Link
            to="/request-help"
            className="emergency-cta px-4 py-2.5 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-theme-dark font-bold text-xs uppercase tracking-wider shadow-emergency-glow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Emergency Request</span>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['ALL', 'active', 'accepted', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all ${
                statusFilter === st
                  ? 'bg-white/15 border-white/30 text-theme-dark'
                  : 'bg-white/5 border-theme-mint/30 text-theme-forest/80 hover:text-theme-dark'
              }`}
            >
              {st === 'ALL' ? 'All Incidents' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Requests Feed */}
        {filteredRequests.length === 0 ? (
          <div className="mx-auto mt-8 max-w-lg rounded-3xl border border-slate-200 bg-[#fffefa] p-12 text-center shadow-[0_14px_40px_rgba(15,23,42,0.10)]">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-black">
              No emergency requests found
            </h3>
            <p className="mx-auto mt-1 max-w-xs text-xs text-slate-600">
              You do not have any emergency requests matching this filter.
            </p>
            <Link
              to="/request-help"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-theme-dark font-bold text-xs uppercase tracking-wider mt-6 shadow-emergency-glow"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Create Emergency Request</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map((req) => (
              <RequestCard key={req.id} request={req} baseLink="/requests" />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
