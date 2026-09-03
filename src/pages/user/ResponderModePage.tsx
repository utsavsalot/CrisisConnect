import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  Check, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  Activity,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { EmergencyNeedCategory } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';

export const ResponderModePage: React.FC = () => {
  const { 
    currentUser, 
    isResponder, 
    isAvailable, 
    capabilities, 
    toggleResponderMode, 
    setAvailability, 
    updateCapabilities 
  } = useAuth();
  
  const { nearbyRequests, acceptRequest } = useEmergency();
  const navigate = useNavigate();

  const [localCaps, setLocalCaps] = useState<EmergencyNeedCategory[]>(capabilities.length > 0 ? capabilities : ['Medical Assistance', 'Medicine']);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const allCategories: EmergencyNeedCategory[] = [
    'Blood',
    'Medicine',
    'Medical Assistance',
    'Food',
    'Transportation',
    'Shelter',
    'Rescue',
    'Water',
    'Other'
  ];

  const handleToggleCap = (cat: EmergencyNeedCategory) => {
    setLocalCaps(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSaveAndGoAvailable = async () => {
    await updateCapabilities(localCaps);
    if (!isResponder) {
      await toggleResponderMode(true);
    } else {
      await setAvailability(true);
    }
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleAcceptNearby = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      navigate(`/requests/${requestId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-theme-light py-8 px-4 sm:px-6 lg:px-8 text-theme-dark">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Main Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-theme-mint/30 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isResponder && isAvailable ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Community Mesh Network
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-theme-dark font-display mt-1">
              🟢 RESPONDER MODE
            </h1>
            <p className="text-xs text-theme-forest/80 mt-0.5">
              Be there when someone nearby needs urgent help in your neighborhood
            </p>
          </div>

          {/* Large Availability Pill Toggle */}
          <div className="flex items-center gap-3 glass-panel p-2 rounded-2xl border border-theme-mint/30">
            <span className="text-xs font-bold text-theme-forest ml-2">Status:</span>
            <button
              onClick={() => {
                if (!isResponder) {
                  toggleResponderMode(true);
                } else {
                  setAvailability(!isAvailable);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                isResponder && isAvailable
                  ? 'bg-emerald-600 text-theme-dark shadow-lg shadow-emerald-600/30'
                  : 'bg-theme-sage text-theme-forest/80 hover:text-theme-dark'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{isResponder && isAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}</span>
            </button>
          </div>
        </div>

        {/* Capabilities Configuration Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-theme-mint/30 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-theme-mint/30 pb-4">
            <div>
              <h2 className="text-lg font-bold text-theme-dark font-display">
                Your Assistance Capabilities
              </h2>
              <p className="text-xs text-theme-forest/80 mt-0.5">
                Select the types of aid you are equipped to provide. You will only receive nearby requests matching these skills.
              </p>
            </div>
            {isSavedNotice && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-in fade-in">
                <Check className="w-4 h-4" /> Capabilities Saved & Active!
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allCategories.map((cat) => {
              const isSelected = localCaps.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleToggleCap(cat)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 text-theme-dark shadow-sm'
                      : 'bg-white/60 border-theme-mint/30 text-theme-forest/80 hover:text-theme-dark/90'
                  }`}
                >
                  <span>{cat}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-emerald-500 text-theme-dark' : 'border border-slate-600'
                    }`}
                  >
                    {isSelected && '✓'}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={handleSaveAndGoAvailable}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-theme-dark font-bold text-xs uppercase tracking-wider shadow-md transition-transform active:scale-95"
            >
              Save & Go Available
            </button>
          </div>
        </div>

        {/* Nearby Requests Feed (Strictly a list/feed - NO MAP FOR RESPONDERS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-bold text-theme-dark font-display">
                Nearby Incident Feed ({nearbyRequests.length})
              </h2>
            </div>
            <span className="text-xs text-theme-forest/80 font-mono">
              RADIUS: &lt; 5.0 KM
            </span>
          </div>

          {nearbyRequests.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center border border-theme-mint/30 max-w-lg mx-auto">
              <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-theme-dark font-display">
                You're all clear right now.
              </h3>
              <p className="text-xs text-theme-forest/80 mt-1 max-w-sm mx-auto">
                Nearby emergency requests matching your capabilities will appear here in real time when someone in your radius requires help.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyRequests.map((req) => (
                <div
                  key={req.id}
                  className="glass-panel rounded-3xl p-6 border border-emergency-500/30 hover:border-emergency-500/60 transition-all flex flex-col justify-between group shadow-emergency-glow/10"
                >
                  <div>
                    {/* Needs & Distance */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-wrap gap-1.5">
                        {req.needs.map(n => (
                          <span
                            key={n}
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emergency-500/20 text-emergency-300 border border-emergency-500/30"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                      <StatusBadge status={req.status} size="sm" />
                    </div>

                    <h3 className="text-base font-bold text-theme-dark mb-2 line-clamp-1">
                      {req.needs.join(' + ')} Needed Nearby
                    </h3>

                    <p className="text-xs text-theme-forest line-clamp-3 leading-relaxed mb-4">
                      {req.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-theme-mint/30 flex items-center justify-between text-xs text-theme-forest/80">
                    <div>
                      <div className="flex items-center gap-1.5 text-theme-forest">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span className="truncate max-w-[180px]">
                          {req.location.address || 'Detected Location'}
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                        {req.distanceKm || 1.8} km away • Posted 2 min ago
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/requests/${req.id}`}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-theme-dark/90 text-xs font-semibold transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleAcceptNearby(req.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-theme-dark font-bold text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
