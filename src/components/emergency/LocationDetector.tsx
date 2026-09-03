import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Edit3, CheckCircle2, AlertTriangle } from 'lucide-react';
import { LocationCoordinates } from '../../types';

interface LocationDetectorProps {
  location: LocationCoordinates;
  onChange: (loc: LocationCoordinates) => void;
}

export const LocationDetector: React.FC<LocationDetectorProps> = ({ location, onChange }) => {
  const [detecting, setDetecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [manualAddress, setManualAddress] = useState(location.address || '');

  const detectLocation = () => {
    setDetecting(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords: LocationCoordinates = {
          latitude: parseFloat(position.coords.latitude.toFixed(4)),
          longitude: parseFloat(position.coords.longitude.toFixed(4)),
          address: location.address || `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        };

        // Try gentle reverse geocoding if available, but never block coordinates
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=16`
          );
          if (resp.ok) {
            const data = await resp.json();
            if (data.display_name) {
              const parts = data.display_name.split(',');
              coords.address = parts.slice(0, 3).join(',').trim();
            }
          }
        } catch {
          // Graceful fallback: coordinates only
        }

        onChange(coords);
        setManualAddress(coords.address || '');
        setDetecting(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setError('Location access is unavailable. Please specify your location below.');
        setDetecting(false);
        // Default to high-density demo coordinates so the request remains immediately dispatchable
        if (!location.latitude) {
          onChange({
            latitude: 40.7128,
            longitude: -74.0060,
            address: 'Greenwich Village, New York, NY'
          });
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const handleManualSave = () => {
    if (manualAddress.trim()) {
      onChange({
        ...location,
        address: manualAddress.trim()
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600">
            <MapPin className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                Incident Location
              </span>
              {detecting ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Detecting your location...
                </span>
              ) : error ? (
                <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                  <AlertTriangle className="w-3 h-3" /> Location access unavailable
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600">
                  <CheckCircle2 className="w-3 h-3" /> Location detected
                </span>
              )}
            </div>

            <p className="mt-0.5 text-sm font-semibold text-black">
              {location.address || `${location.latitude}° N, ${location.longitude}° W`}
            </p>
            <p className="font-mono text-[10px] text-slate-600">
              GPS: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsEditing(e => !e)}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-black transition-colors hover:bg-red-100"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel' : 'Change Location'}</span>
          </button>
          <button
            type="button"
            onClick={detectLocation}
            title="Redetect location"
            className="rounded-lg bg-slate-100 p-1.5 text-red-700 transition-colors hover:bg-red-100"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${detecting ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-3 pt-3 border-t border-theme-mint/30 flex items-center gap-2 animate-in fade-in duration-150">
          <input
            type="text"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="Enter street, landmark, or apartment details..."
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-black placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleManualSave}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-theme-dark rounded-xl text-xs font-semibold"
          >
            Save Location
          </button>
        </div>
      )}
    </div>
  );
};
