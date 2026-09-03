import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, User, Building2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'ngo' ? 'ngo' : 'user';

  const [selectedRole, setSelectedRole] = useState<'user' | 'ngo'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [orgType, setOrgType] = useState('Humanitarian Relief');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    try {
      await signup({
        name,
        email,
        phone: phone || '+1 (555) 019-2831',
        role: selectedRole,
        orgType: selectedRole === 'ngo' ? orgType : undefined,
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
          address: 'New York, NY'
        }
      });

      if (selectedRole === 'ngo') {
        navigate('/ngo/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#070B14] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden grain-overlay">
      <div className="w-full max-w-lg relative z-10">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emergency-600/20 border border-emergency-500/40 flex items-center justify-center text-emergency-500 mx-auto mb-3 shadow-emergency-glow">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Join the CrisisConnect Network
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Choose your account role to begin coordinating immediate assistance
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole('user')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedRole === 'user'
                ? 'border-emerald-500 bg-emerald-500/15 shadow-lg'
                : 'border-white/10 bg-slate-900/60 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <User className={`w-5 h-5 ${selectedRole === 'user' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="font-bold text-sm text-white">USER</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              "I need help, or I may also respond to help neighbors."
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('ngo')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedRole === 'ngo'
                ? 'border-sky-500 bg-sky-500/15 shadow-lg'
                : 'border-white/10 bg-slate-900/60 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Building2 className={`w-5 h-5 ${selectedRole === 'ngo' ? 'text-sky-400' : 'text-slate-400'}`} />
              <span className="font-bold text-sm text-white">NGO / ORG</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              "We provide disaster assistance and large-scale resources."
            </p>
          </button>
        </div>

        {/* Form Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                {selectedRole === 'ngo' ? 'Organization Name' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === 'ngo' ? 'e.g. Red Cross Metro Relief' : 'e.g. Alex Rivera'}
                required
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emergency-500"
              />
            </div>

            {selectedRole === 'ngo' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Organization Type
                </label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="Humanitarian Disaster Relief">Humanitarian Disaster Relief</option>
                  <option value="Medical & Mobile Health Services">Medical & Mobile Health Services</option>
                  <option value="Search & Water Rescue Operations">Search & Water Rescue Operations</option>
                  <option value="Food Bank & Nutrition Aid">Food Bank & Nutrition Aid</option>
                  <option value="Temporary Shelter Operations">Temporary Shelter Operations</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@email.com"
                  required
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emergency-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Emergency Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emergency-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emergency-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Location permission enabled automatically for rapid crisis dispatch.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white font-bold text-xs uppercase tracking-wider shadow-emergency-glow transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-white font-bold hover:underline">
              Sign In Instead
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
