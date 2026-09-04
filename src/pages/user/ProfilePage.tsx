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
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-[#fffefa] p-6 shadow-[0_14px_40px_rgba(15,23,42,0.10)] sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-xl font-bold text-red-700">
              {name.charAt(0)}
            </div>
            <div>
              <h2 className="font-display text-xl font-black text-black">{name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700">
                  {role === 'ngo' ? 'Verified NGO Partner' : 'Verified Citizen'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-red-100 pt-4 text-xs sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3">
              <Mail className="h-4 w-4 text-red-600" />
              <div>
                <span className="block text-[10px] text-red-700">Email Address</span>
                <span className="font-semibold text-black">{currentUser.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3">
              <Phone className="h-4 w-4 text-red-600" />
              <div>
                <span className="block text-[10px] text-red-700">Emergency Phone</span>
                <span className="font-semibold text-black">{currentUser.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 sm:col-span-2">
              <MapPin className="h-4 w-4 text-red-600" />
              <div>
                <span className="block text-[10px] text-red-700">Default Coordinates / Dispatch Zone</span>
                <span className="font-semibold text-black">{currentUser.location.address || 'New York Metro'}</span>
              </div>
            </div>

            {!isNGO && (
              <div className="rounded-xl border border-slate-100 bg-white p-3 sm:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-red-700">
                    Community Helper Status
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    Boolean((currentUser as any).responderMode && (currentUser as any).isAvailable)
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border border-slate-200 bg-slate-100 text-slate-600'
                  }`}>
                    {Boolean((currentUser as any).responderMode && (currentUser as any).isAvailable) ? 'Active & Available' : 'Off Duty'}
                  </span>
                </div>
                {(currentUser as any).capabilities && (currentUser as any).capabilities.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(currentUser as any).capabilities.map((c: string) => (
                      <span key={c} className="rounded-md border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
