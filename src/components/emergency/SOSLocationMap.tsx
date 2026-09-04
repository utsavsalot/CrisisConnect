import React, { useEffect } from 'react';
import { Circle, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { Minus, Plus } from 'lucide-react';
import L from 'leaflet';
import { LocationCoordinates } from '../../types';

const centerPin = L.divIcon({
  className: 'sos-location-pin',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  html: '<span style="display:block;width:16px;height:16px;margin:4px;border-radius:999px;background:#FF4D4D;border:3px solid white;box-shadow:0 0 0 7px rgba(255,77,77,.25),0 0 18px #FF4D4D"></span>',
});

const Recenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, 15, { animate: true }); }, [center, map]);
  return null;
};

const ZoomControls: React.FC = () => {
  const map = useMap();

  return (
    <div className="absolute right-3 top-3 z-[1000] flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
      <button
        type="button"
        aria-label="Zoom in"
        title="Zoom in"
        onClick={() => map.zoomIn()}
        className="flex h-9 w-9 items-center justify-center text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Zoom out"
        title="Zoom out"
        onClick={() => map.zoomOut()}
        className="flex h-9 w-9 items-center justify-center border-t border-slate-200 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export const SOSLocationMap: React.FC<{ location: LocationCoordinates }> = ({ location }) => {
  const center: [number, number] = [location.latitude, location.longitude];
  return (
    <div className="h-48 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <MapContainer center={center} zoom={15} minZoom={3} maxZoom={19} scrollWheelZoom={false} zoomControl={false} className="h-full w-full">
        <ZoomControls />
        <Recenter center={center} />
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Circle center={center} radius={250} pathOptions={{ color: '#FF4D4D', fillColor: '#FF4D4D', fillOpacity: 0.08 }} />
        <Marker position={center} icon={centerPin} />
      </MapContainer>
    </div>
  );
};
