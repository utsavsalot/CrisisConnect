import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Heart, 
  Pill, 
  Activity, 
  Utensils, 
  Home, 
  Truck, 
  LifeBuoy, 
  Droplets,
  Layers,
  MapPin,
  Clock,
  Shield,
  X,
  AlertTriangle
} from 'lucide-react';
import { EmergencyRequest, EmergencyNeedCategory } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

// Helper to center map smoothly
const MapRecenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

// Create custom SVG Leaflet DivIcon
const createCustomIcon = (need: EmergencyNeedCategory, status: string) => {
  const isEmergency = status === 'active';
  const color = isEmergency ? '#EF4444' : '#38BDF8';

  const html = `
    <div style="
      width: 36px;
      height: 36px;
      background: ${isEmergency ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.25)'};
      border: 2px solid ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 16px ${color};
      position: relative;
    ">
      <div style="
        width: 12px;
        height: 12px;
        background: ${color};
        border-radius: 50%;
      "></div>
      ${isEmergency ? `
        <div style="
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px solid ${color};
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
      ` : ''}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-emergency-pin',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

interface NGOLiveMapProps {
  requests: EmergencyRequest[];
  onAcceptRequest: (id: string) => void;
}

export const NGOLiveMap: React.FC<NGOLiveMapProps> = ({ requests, onAcceptRequest }) => {
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [tileError, setTileError] = useState(false);

  const defaultCenter: [number, number] = [40.7188, -73.9980]; // NYC Center

  const filteredRequests = requests.filter(r => {
    if (categoryFilter === 'ALL') return true;
    return r.needs.includes(categoryFilter as EmergencyNeedCategory);
  });

  const activeFocus = selectedRequest 
    ? [selectedRequest.location.latitude, selectedRequest.location.longitude] as [number, number]
    : defaultCenter;

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] rounded-3xl overflow-hidden glass-panel border border-theme-mint/30 flex flex-col lg:flex-row shadow-2xl">
      
      {/* Interactive Map Canvas or Fallback */}
      <div className="relative flex-1 h-full min-h-[400px]">
        
        {!tileError ? (
          <MapContainer
            center={defaultCenter}
            zoom={13}
            scrollWheelZoom={true}
            className="w-full h-full z-10"
          >
            <MapRecenter center={activeFocus} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              eventHandlers={{
                tileerror: () => {
                  console.warn('Map tile loading error, enabling simulated radar fallback');
                  setTileError(true);
                }
              }}
            />

            {filteredRequests.map((req) => (
              <Marker
                key={req.id}
                position={[req.location.latitude, req.location.longitude]}
                icon={createCustomIcon(req.needs[0] || 'Other', req.status)}
                eventHandlers={{
                  click: () => setSelectedRequest(req)
                }}
              >
                <Popup className="emergency-popup">
                  <div className="p-1 text-slate-900">
                    <div className="font-bold text-xs">{req.needs.join(', ')}</div>
                    <div className="text-[11px] text-slate-600 line-clamp-2 mt-1">{req.description}</div>
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="mt-2 text-[10px] font-bold text-sky-600 hover:underline"
                    >
                      Inspect Dossier →
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          /* Polished Emergency Radar Grid Fallback */
          <div className="w-full h-full bg-theme-light relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
            <div className="absolute w-[500px] h-[500px] rounded-full border border-sky-500/20 flex items-center justify-center">
              <div className="w-[350px] h-[350px] rounded-full border border-sky-500/30 flex items-center justify-center">
                <div className="w-[200px] h-[200px] rounded-full border border-emergency-500/30 radar-sweep" />
              </div>
            </div>

            {/* Render plotted pins */}
            {filteredRequests.map((req, idx) => {
              const xOffset = ((req.location.longitude + 74.006) * 1500);
              const yOffset = -((req.location.latitude - 40.712) * 1500);
              return (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  style={{
                    transform: `translate(${xOffset}px, ${yOffset}px)`
                  }}
                  className="absolute p-2 rounded-full bg-emergency-600/30 border border-emergency-500 text-theme-dark shadow-emergency-glow hover:scale-125 transition-transform"
                >
                  <MapPin className="w-4 h-4 text-emergency-500 animate-bounce" />
                </button>
              );
            })}

            <div className="absolute top-4 left-4 p-3 rounded-xl glass-panel border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Simulated Emergency Radar Grid Active</span>
            </div>
          </div>
        )}

        {/* Floating Category Filter Pills on Top of Map */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {['ALL', 'Medical Assistance', 'Blood', 'Rescue', 'Medicine', 'Food', 'Shelter', 'Transportation'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase whitespace-nowrap backdrop-blur-md border transition-all ${
                categoryFilter === cat
                  ? 'bg-emergency-600 border-emergency-500 text-theme-dark shadow-emergency-glow'
                  : 'bg-white/80 hover:bg-theme-sage text-theme-forest border-theme-mint/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Side Emergency Drawer / List */}
      <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-theme-mint/30 bg-white/70 backdrop-blur-2xl flex flex-col h-72 lg:h-full z-20">
        
        <div className="p-4 border-b border-theme-mint/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-theme-dark">
              Emergency Queue ({filteredRequests.length})
            </span>
          </div>
          {selectedRequest && (
            <button
              onClick={() => setSelectedRequest(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-theme-forest/80 hover:text-theme-dark text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* If a request is inspected */}
        {selectedRequest ? (
          <div className="p-4 overflow-y-auto space-y-4 flex-1 no-scrollbar animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <StatusBadge status={selectedRequest.status} size="sm" />
              <span className="text-xs text-theme-forest/80 font-mono">
                {selectedRequest.distanceKm || 1.2} km away
              </span>
            </div>

            <div>
              <h4 className="font-bold text-base text-theme-dark">
                {selectedRequest.needs.join(' + ')}
              </h4>
              <p className="text-xs text-theme-forest mt-2 leading-relaxed">
                {selectedRequest.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-theme-mint/30 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-theme-forest/80">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-theme-dark/90 truncate">{selectedRequest.location.address || 'Detected Location'}</span>
              </div>
              <div className="flex items-center gap-2 text-theme-forest/80">
                <Clock className="w-3.5 h-3.5 text-theme-forest/80" />
                <span>Reported by {selectedRequest.requesterName}</span>
              </div>
            </div>

            {selectedRequest.status === 'active' && (
              <button
                onClick={() => {
                  onAcceptRequest(selectedRequest.id);
                  setSelectedRequest({ ...selectedRequest, status: 'accepted' });
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-theme-dark font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Shield className="w-4 h-4" />
                <span>Accept & Dispatch Unit</span>
              </button>
            )}
          </div>
        ) : (
          /* List of requests */
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-theme-forest/60 text-xs">
                No active emergencies in this category.
              </div>
            ) : (
              filteredRequests.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRequest(r)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-theme-mint/20 hover:border-sky-500/30 cursor-pointer transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-emergency-400">
                      {r.needs[0]}
                    </span>
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                  <p className="text-xs text-theme-dark/90 line-clamp-2 leading-snug">
                    {r.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-theme-forest/80 mt-2">
                    <span className="truncate max-w-[160px]">{r.location.address || 'Nearby Area'}</span>
                    <span>{r.distanceKm || 0.8} km</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
