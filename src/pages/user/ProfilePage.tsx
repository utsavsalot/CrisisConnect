import React from 'react';
import { User, Shield, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { currentUser, role } = useAuth();

  if (!currentUser) return null;

  const isNGO = role === 'ngo';
  const name = 'name' in currentUser ? currentUser.name : currentUser.orgName;

  return (
    <div className="min-h-screen bg-theme-light py-8 px-4 sm:px-6 lg:px-8 text-theme-dark">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="border-b border-theme-mint/30 pb-4">
          <h1 className="text-2xl font-black text-theme-dark font-display">
            {isNGO ? 'Organization Profile' : 'User Profile'}
          </h1>
          <p className="text-xs text-theme-forest/80 mt-0.5">
            Your emergency mesh credentials and contact dispatch telemetry
          </p>
        </div>

        {/* Identity Glass Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-theme-mint/30 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-theme-sage border border-theme-mint/40 flex items-center justify-center text-theme-dark/90 text-xl font-bold">
              {name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-theme-dark font-display">{name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {role === 'ngo' ? 'Verified NGO Partner' : 'Verified Citizen'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-theme-mint/30 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <Mail className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-theme-forest/80 block text-[10px]">Email Address</span>
                <span className="text-theme-dark font-semibold">{currentUser.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <Phone className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-theme-forest/80 block text-[10px]">Emergency Phone</span>
                <span className="text-theme-dark font-semibold">{currentUser.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 sm:col-span-2">
              <MapPin className="w-4 h-4 text-emergency-500" />
              <div>
                <span className="text-theme-forest/80 block text-[10px]">Default Coordinates / Dispatch Zone</span>
                <span className="text-theme-dark font-semibold">{currentUser.location.address || 'New York Metro'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
