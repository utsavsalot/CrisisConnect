import React from 'react';
import { User, Shield, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { currentUser, role, isResponder, capabilities } = useAuth();

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
                  {role === 'ngo' ? 'Verified NGO Partner' : (isResponder ? 'Active Citizen Responder' : 'Verified Citizen')}
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

          {/* Responder capabilities if User */}
          {!isNGO && (
            <div className="pt-4 border-t border-theme-mint/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-theme-forest">
                  Registered Responder Capabilities ({capabilities.length})
                </span>
                <Link to="/responder" className="text-xs text-emerald-400 hover:underline">
                  Configure
                </Link>
              </div>

              {capabilities.length === 0 ? (
                <p className="text-xs text-theme-forest/60">
                  No active capabilities configured yet. Enable Responder Mode to help nearby people.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {capabilities.map(c => (
                    <span
                      key={c}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{c}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
