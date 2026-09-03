import React from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { NGOLiveMap } from '../../components/map/NGOLiveMap';
import { MapPin } from 'lucide-react';

export const LiveEmergencyMapPage: React.FC = () => {
  const { requests, acceptRequest } = useEmergency();

  return (
    <div className="min-h-screen bg-[#070B14] py-4 px-4 sm:px-6 lg:px-8 text-slate-100 flex flex-col">
      <div className="max-w-7xl mx-auto w-full space-y-4 flex-1 flex flex-col">
        
        {/* Title Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <MapPin className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                LIVE EMERGENCY MAP
              </h1>
              <p className="text-[11px] text-slate-400">
                Exclusive NGO Operations Geographic Incident Triage
              </p>
            </div>
          </div>
        </div>

        {/* The Leaflet Live Map Component */}
        <div className="flex-1">
          <NGOLiveMap requests={requests} onAcceptRequest={acceptRequest} />
        </div>

      </div>
    </div>
  );
};
