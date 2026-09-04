import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  MapPin, 
  Users, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Activity,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmergencyNeedCategory } from '../../types';

const ALL_CAPABILITIES: EmergencyNeedCategory[] = [
  'Medical Assistance',
  'Blood',
  'Medicine',
  'Food',
  'Shelter',
  'Transportation',
  'Rescue',
  'Water',
  'Other'
];

export const CommunityHelpPage: React.FC = () => {
  const { 
    currentUser, 
    isResponder, 
    isAvailable, 
    capabilities, 
    toggleResponderMode, 
    setAvailability, 
    updateCapabilities 
  } = useAuth();

  const { requests, acceptRequest } = useEmergency();
  const navigate = useNavigate();

  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      await toggleResponderMode(true);
      await setAvailability(true);
    } else {
      await setAvailability(false);
      await toggleResponderMode(false);
    }
  };

  const handleCapabilityClick = async (cat: EmergencyNeedCategory) => {
    if (capabilities.includes(cat)) {
      await updateCapabilities(capabilities.filter(c => c !== cat));
    } else {
      await updateCapabilities([...capabilities, cat]);
    }
  };

  const handleAccept = async (e: React.MouseEvent, requestId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (acceptingId) return;
    setAcceptingId(requestId);
    try {
      await acceptRequest(requestId);
      navigate(`/requests/${requestId}`);
    } catch (err) {
      console.error('Accept request error:', err);
    } finally {
      setAcceptingId(null);
    }
  };

  // Filter requests waiting for community help (exclude user's own requests and requests already taken by others)
  const incomingRequests = requests.filter(r => {
    if (currentUser && r.requesterId === currentUser.uid) return false;

    const isMyActiveMission = (r.communityHelperId === currentUser?.uid || r.acceptedBy === currentUser?.uid) && (r.status === 'accepted' || r.status === 'in_progress');
    const isWaitingForHelp = r.status === 'active' && !r.communityHelperId;

    if (!isMyActiveMission && !isWaitingForHelp) return false;

    if (selectedFilter !== 'ALL' && !r.needs.includes(selectedFilter as EmergencyNeedCategory)) {
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
    <div className="min-h-screen bg-[#f4f5f8] px-4 py-8 text-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-black/15 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[.2em] text-red-600">
                Community Volunteer Network
              </span>
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <h1 className="mt-1 font-display text-4xl font-black uppercase leading-none text-black sm:text-5xl">
              Offer Community Help
            </h1>
            <p className="mt-3 text-sm text-black/60">
              Make yourself available to help people nearby during emergencies.
            </p>
          </div>
        </div>

        {/* Availability Toggle Main Card */}
        <div className="rounded-[2rem] border-2 border-black bg-white p-6 sm:p-8 shadow-[0_20px_55px_rgba(15,23,42,0.14)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/10">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 border border-red-200 text-red-600 shadow-sm">
                <Heart className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-[.2em] text-red-600">
                    Status
                  </span>
                  {isResponder && isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Volunteer Mode Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-300 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                      Off-Duty / Inactive
                    </span>
                  )}
                </div>
                <h2 className="mt-1 font-display text-2xl font-black uppercase text-black sm:text-3xl">
                  {isResponder && isAvailable ? 'You Are Available to Help' : 'Volunteer Mode is Disabled'}
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-black/70">
                  {isResponder && isAvailable
                    ? 'You will receive alerts for matching nearby emergencies.'
                    : 'Turn ON to receive nearby emergency alerts.'}
                </p>
              </div>
            </div>

            {/* Big Switch Control */}
            <div className="flex items-center gap-4 shrink-0 self-start md:self-center bg-[#f4f5f8] border border-black/10 rounded-2xl p-4">
              <div className="text-right">
                <span className="block text-xs font-black uppercase tracking-wider text-black">
                  {isResponder && isAvailable ? 'Available' : 'Unavailable'}
                </span>
                <span className="text-[11px] font-medium text-black/50">
                  {isResponder && isAvailable ? 'Alerts Enabled' : 'Click to enable'}
                </span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={isResponder && isAvailable}
                  onChange={(e) => handleToggle(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-8 w-14 rounded-full bg-slate-200 after:absolute after:left-[4px] after:top-[4px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-6 peer-checked:after:border-white peer-focus:outline-none shadow-inner"></div>
              </label>
            </div>
          </div>

          {/* Capabilities Section */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-black uppercase tracking-wide text-black">
                  Your Help Capabilities
                </h3>
                <p className="text-xs text-black/60">
                  Select what assistance you can provide when an emergency occurs.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-red-600">
                {capabilities.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {ALL_CAPABILITIES.map((cat) => {
                const isSelected = capabilities.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCapabilityClick(cat)}
                    className={`flex items-center justify-between rounded-xl p-3 text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-2 border-red-600 bg-red-600 text-white shadow-md'
                        : 'border border-black/15 bg-[#f4f5f8] text-black hover:border-black/30 hover:bg-white'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-xs">{isSelected ? '✓' : '+'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Incoming Requests Queue Waiting for Volunteer Help */}
        <div className="rounded-[2rem] border-2 border-black bg-white p-6 sm:p-8 shadow-[0_20px_55px_rgba(15,23,42,0.14)] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-xs font-mono font-bold uppercase tracking-[.2em] text-red-600">
                  Incident Feed
                </span>
              </div>
              <h2 className="mt-1 font-display text-2xl font-black uppercase text-black">
                Incoming Requests Waiting For Help
              </h2>
              <p className="text-xs text-black/60">
                Live emergencies in your area where community volunteers can step in.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-black bg-[#f4f5f8] border border-black/10 px-3 py-1 rounded-full">
                {incomingRequests.length} Active {incomingRequests.length === 1 ? 'Emergency' : 'Emergencies'}
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-black/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search emergency needs, address..."
                className="w-full bg-[#f4f5f8] border border-black/10 rounded-xl pl-9 pr-3 py-2 text-xs text-black placeholder:text-black/40 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
              {['ALL', 'Medical Assistance', 'Blood', 'Rescue', 'Medicine', 'Food', 'Shelter', 'Transportation'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider whitespace-nowrap border transition-all ${
                    selectedFilter === cat
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-[#f4f5f8] border-black/10 text-black/70 hover:border-black/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Requests List */}
          {!isResponder || !isAvailable ? (
            <div className="rounded-2xl border border-black/10 bg-[#f4f5f8] p-8 text-center space-y-3">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                <Heart className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-black">
                Volunteer Mode is Currently Off
              </p>
              <p className="text-xs text-black/60 max-w-sm mx-auto">
                Turn ON "Available to Help" above to activate incoming requests and respond to nearby emergencies.
              </p>
            </div>
          ) : incomingRequests.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-[#f4f5f8] p-10 text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-black">
                All Clear in Your Area
              </p>
              <p className="text-xs text-black/60 max-w-sm mx-auto">
                No active emergency requests are currently waiting for response. You are standing by to receive live alerts.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => {
                const isMyAccepted = req.communityHelperId === currentUser?.uid;
                const canAccept = req.status === 'active' && !req.communityHelperId;

                return (
                  <div
                    key={req.id}
                    className={`rounded-2xl border p-5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      isMyAccepted
                        ? 'border-emerald-500/40 bg-emerald-50/40'
                        : 'border-black/10 bg-[#f4f5f8] hover:border-red-300 hover:bg-red-50/30'
                    }`}
                  >
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {req.needs.map((need) => (
                          <span
                            key={need}
                            className="rounded-md bg-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-white"
                          >
                            {need}
                          </span>
                        ))}
                        <StatusBadge status={req.status} size="sm" />
                        {isMyAccepted && (
                          <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                            You are Responding
                          </span>
                        )}
                        {req.communityHelperId && !isMyAccepted && (
                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-700">
                            Volunteer En Route ({req.communityHelperName})
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-black font-medium leading-relaxed">
                        {req.description}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-black/70 flex-wrap pt-1 border-t border-black/5">
                        <div className="flex items-center gap-1.5 font-bold text-black">
                          <Users className="h-3.5 w-3.5 text-red-600" />
                          <span>{req.requesterName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-red-600" />
                          <span>{req.location.address || 'Detected Location'}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-black/50">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${req.location.latitude},${req.location.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-red-600 hover:underline font-bold ml-auto"
                        >
                          Directions ↗
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                      {canAccept && (
                        <button
                          type="button"
                          onClick={(e) => handleAccept(e, req.id)}
                          disabled={acceptingId === req.id}
                          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-600/20 transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <Heart className="w-3.5 h-3.5 fill-white" />
                          <span>{acceptingId === req.id ? 'Connecting...' : 'I Can Help'}</span>
                        </button>
                      )}

                      <Link
                        to={`/requests/${req.id}`}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                          isMyAccepted
                            ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
                            : 'bg-white border-black/15 text-black hover:border-black hover:bg-black hover:text-white'
                        }`}
                      >
                        <span>{isMyAccepted ? 'Live Chat & Tracking' : 'View Request'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-[2rem] border border-black/10 bg-white/95 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-black">1. Localized Matching & Escalation</h4>
            <p className="text-xs text-black/70 leading-relaxed">
              Matching starts with nearby helpers and automatically expands its search radius over time until assistance is accepted.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-white/95 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-black">2. Dual NGO Coordination</h4>
            <p className="text-xs text-black/70 leading-relaxed">
              When you accept an emergency, authorized NGOs still see the request and can deploy official backup support.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-white/95 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-black">3. Real-Time Chat</h4>
            <p className="text-xs text-black/70 leading-relaxed">
              Communicate in real time with the requester and NGO dispatchers on the incident tracking channel.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
