import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthSafetyPanel } from '../../components/navigation/AuthSafetyPanel';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
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

  return (
    <div className="h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain scroll-smooth bg-[#f4f5f8] p-4 sm:p-8 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/80 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex min-h-full w-full max-w-[80rem] items-center justify-center gap-8 py-8 sm:gap-10 sm:py-12 xl:gap-14">
        <AuthSafetyPanel storyCount={2} showIntro={false} />
        <div className="w-full max-w-md">

        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto mb-4 shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black font-display">
            Welcome to CrisisConnect
          </h1>
          <p className="text-xs text-black/60 mt-2">
            Sign in to access your dashboard, responder feed, or NGO command
          </p>
        </div>

        {/* Login Glass Panel */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/95 border border-white shadow-[0_20px_55px_rgba(15,23,42,0.14)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-black/35 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@crisisconnect.org"
                  required
                  className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-black">
                  Password
                </label>
                <a href="#" className="text-[11px] text-red-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-black/35 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f4f5f8] border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_10px_25px_rgba(239,68,68,0.28)] transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-black/60">
            Don't have an account?{' '}
            <Link to="/signup" className="text-black font-bold hover:underline">
              Sign Up Now
            </Link>
          </div>
        </div>

        </div>
        <AuthSafetyPanel storyCount={2} storyStart={2} showIntro={false} />
      </div>
    </div>
  );
};
