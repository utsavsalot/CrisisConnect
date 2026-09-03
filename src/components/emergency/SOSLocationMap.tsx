import React, { useEffect } from 'react';
import { Circle, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
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

export const SOSLocationMap: React.FC<{ location: LocationCoordinates }> = ({ location }) => {
  const center: [number, number] = [location.latitude, location.longitude];
  return (
    <div className="h-48 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <MapContainer center={center} zoom={15} scrollWheelZoom={false} zoomControl={false} className="h-full w-full">
        <Recenter center={center} />
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Circle center={center} radius={250} pathOptions={{ color: '#FF4D4D', fillColor: '#FF4D4D', fillOpacity: 0.08 }} />
        <Marker position={center} icon={centerPin} />
      </MapContainer>
    </div>
  );
};
