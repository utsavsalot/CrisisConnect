import React from 'react';
import { Sun, Moon, Bell, Shield, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070B14] py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="border-b border-white/10 pb-4">
          <h1 className="text-2xl font-black text-white font-display">
            Platform Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Appearance, immediate theme tokens, notifications, and telemetry
          </p>
        </div>

        {/* Appearance Settings */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Appearance & Theme
          </h3>
          <p className="text-xs text-slate-400">
            Toggle instantly between high-contrast dark emergency-tech mode and crisp daytime light mode.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900 border-sky-400 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-400" />
              <div className="text-left">
                <span className="font-bold text-xs block">Dark Mode</span>
                <span className="text-[10px] text-slate-500">OLED Navy & Glass</span>
              </div>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                theme === 'light'
                  ? 'bg-slate-200 border-sky-600 text-slate-900 shadow-lg'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <div className="text-left">
                <span className="font-bold text-xs block">Light Mode</span>
                <span className="text-[10px] text-slate-400">High Visibility</span>
              </div>
            </button>
          </div>
        </div>

        {/* Safety & Privacy */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Privacy & Geolocation Controls
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            CrisisConnect enforces privacy-preserving radius dispatch. Before a responder commits to your emergency request, 
            only approximate street-level coordinates are exposed. Exact contact details unlock only upon verified mission acceptance.
          </p>
        </div>

        {/* Account Termination / Sign Out */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Sign Out</h4>
            <p className="text-xs text-slate-400">End your active emergency dispatch session</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
