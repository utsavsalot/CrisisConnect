import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Lock, Mail, ArrowRight, User, Shield, Building2, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, switchDemoAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (roleKey: 'demo-user' | 'demo-responder' | 'demo-ngo' | 'demo-admin') => {
    switchDemoAccount(roleKey);
    if (from && (roleKey === 'demo-user' || roleKey === 'demo-responder')) {
      navigate(from, { replace: true });
      return;
    }
    if (roleKey === 'demo-ngo') {
      navigate('/ngo/dashboard');
    } else if (roleKey === 'demo-admin') {
      navigate('/admin');
    } else if (roleKey === 'demo-responder') {
      navigate('/responder');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#070B14] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden grain-overlay">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emergency-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emergency-600/20 border border-emergency-500/40 flex items-center justify-center text-emergency-500 mx-auto mb-4 shadow-emergency-glow">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Welcome to CrisisConnect
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Sign in to access your dashboard, responder feed, or NGO command
          </p>
        </div>

        {/* Login Glass Panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@crisisconnect.org"
                  required
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emergency-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <a href="#" className="text-[11px] text-sky-400 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emergency-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-white font-bold text-xs uppercase tracking-wider shadow-emergency-glow transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Hackathon 1-Click Evaluation Presets */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
              ⚡ Instant 1-Click Hackathon Evaluation
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('demo-user')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center gap-2 group"
              >
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">Demo User</div>
                  <div className="text-[9px] text-slate-400">Needs help</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('demo-responder')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-emerald-500/30 text-left transition-colors flex items-center gap-2 group"
              >
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-emerald-300 truncate">Responder ON</div>
                  <div className="text-[9px] text-slate-400">Dr. Sarah (User)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('demo-ngo')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-sky-500/30 text-left transition-colors flex items-center gap-2 group"
              >
                <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-sky-300 truncate">Demo NGO</div>
                  <div className="text-[9px] text-slate-400">Map & resources</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('demo-admin')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-500/30 text-left transition-colors flex items-center gap-2 group"
              >
                <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-amber-300 truncate">Demo Admin</div>
                  <div className="text-[9px] text-slate-400">Fallback dispatch</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white font-bold hover:underline">
              Sign Up Now
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
