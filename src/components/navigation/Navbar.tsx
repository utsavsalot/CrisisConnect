import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Bell, 
  User, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  Activity, 
  Layers,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { RequestHelpButton } from '../ui/RequestHelpButton';

export const Navbar: React.FC = () => {
  const { currentUser, role, isResponder, isAvailable, logout, switchDemoAccount } = useAuth();
  const { unreadNotificationCount } = useEmergency();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const isPublic = !currentUser || location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  interface NavLinkItem {
    label: string;
    path: string;
    badge?: string;
    badgeCount?: number;
    isHighlight?: boolean;
  }

  const userNavLinks: NavLinkItem[] = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Requests', path: '/requests' },
    { label: 'Responder Mode', path: '/responder', badge: isResponder ? (isAvailable ? 'ACTIVE' : 'STANDBY') : undefined },
    { label: 'Notifications', path: '/notifications', badgeCount: unreadNotificationCount },
    { label: 'Profile', path: '/profile' },
  ];

  const ngoNavLinks: NavLinkItem[] = [
    { label: 'Dashboard', path: '/ngo/dashboard' },
    { label: 'Requests', path: '/ngo/requests' },
    { label: 'Live Map', path: '/ngo/map', isHighlight: true },
    { label: 'Active Missions', path: '/ngo/active' },
    { label: 'Resources', path: '/ngo/resources' },
    { label: 'Notifications', path: '/notifications', badgeCount: unreadNotificationCount },
  ];

  const adminNavLinks: NavLinkItem[] = [
    { label: 'Admin Dispatch', path: '/admin' },
    { label: 'Requests', path: '/ngo/requests' },
    { label: 'Live Map', path: '/ngo/map' },
    { label: 'Notifications', path: '/notifications', badgeCount: unreadNotificationCount },
  ];

  const currentLinks = role === 'admin' 
    ? adminNavLinks 
    : role === 'ngo' 
      ? ngoNavLinks 
      : userNavLinks;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[var(--bg-primary)]/85 border-b border-[var(--border-color)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to={currentUser ? (role === 'ngo' ? '/ngo/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emergency-600/20 border border-emergency-500/40 flex items-center justify-center text-emergency-500 shadow-emergency-glow group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5 text-emergency-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-slate-100 font-display">
                CRISIS<span className="text-emergency-500">CONNECT</span>
              </span>
              <span className="text-[9px] tracking-widest text-slate-400 font-semibold uppercase -mt-1 hidden sm:block">
                Real-Time Emergency Network
              </span>
            </div>
          </Link>

          {/* Role Pill Indicator if authenticated */}
          {currentUser && (
            <div className="hidden lg:flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-white/5 text-slate-300">
              {role === 'ngo' ? (
                <>
                  <ShieldCheck className="w-3 h-3 text-sky-400" />
                  <span className="text-sky-400">NGO Operations</span>
                </>
              ) : role === 'admin' ? (
                <>
                  <Activity className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400">Admin Command</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">
                    User {isResponder ? (isAvailable ? '• Responder Active' : '• Responder Standby') : ''}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links for Desktop */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {isPublic ? (
            <>
              <a href="#how-it-works" className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#network" className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors">
                Live Network
              </a>
              <a href="#crisis-ai" className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors">
                CrisisAI
              </a>
              <Link to="/login" className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all">
                Sign Up
              </Link>
            </>
          ) : (
            currentLinks.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                    active
                      ? 'text-white bg-white/10 border border-white/10 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {item.label === 'Live Map' && <MapPin className="w-3.5 h-3.5 text-sky-400 animate-pulse" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 text-[9px] rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                  {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                    <span className="w-4 h-4 rounded-full text-[10px] font-bold bg-emergency-500 text-white flex items-center justify-center">
                      {item.badgeCount}
                    </span>
                  )}
                </Link>
              );
            })
          )}
        </nav>

        {/* Right Section: Persistent Request Help + Demo Switcher + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Switcher Dropdown for Hackathon Evaluators */}
          <div className="relative">
            <button
              onClick={() => setDemoMenuOpen(o => !o)}
              title="Switch demo persona"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-tech-blue/30 bg-tech-blue/10 text-tech-cyan hover:bg-tech-blue/20 transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Demo Switcher</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl glass-panel p-2 shadow-2xl z-50 text-xs border border-white/15 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10">
                  Switch Hackathon Persona
                </div>
                <button
                  onClick={() => {
                    switchDemoAccount('demo-user');
                    setDemoMenuOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-white">👤 Alex Rivera (Citizen)</div>
                    <div className="text-[10px] text-slate-400">Normal user requesting help</div>
                  </div>
                  {currentUser?.uid === 'demo-user' && <span className="text-emerald-400 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => {
                    switchDemoAccount('demo-responder');
                    setDemoMenuOpen(false);
                    navigate('/responder');
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-emerald-400">🟢 Dr. Sarah Chen (Responder)</div>
                    <div className="text-[10px] text-slate-400">User with Responder Mode ON</div>
                  </div>
                  {currentUser?.uid === 'demo-responder' && <span className="text-emerald-400 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => {
                    switchDemoAccount('demo-ngo');
                    setDemoMenuOpen(false);
                    navigate('/ngo/dashboard');
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-sky-400">🏢 Metro Relief (NGO)</div>
                    <div className="text-[10px] text-slate-400">Operations, Map & Resources</div>
                  </div>
                  {currentUser?.uid === 'demo-ngo' && <span className="text-emerald-400 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => {
                    switchDemoAccount('demo-admin');
                    setDemoMenuOpen(false);
                    navigate('/admin');
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-amber-400">⚡ Marcus Vance (Admin)</div>
                    <div className="text-[10px] text-slate-400">Fallback unaccepted dispatch</div>
                  </div>
                  {currentUser?.uid === 'demo-admin' && <span className="text-emerald-400 font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>

          <ThemeToggle />

          {/* Persistent Global 🚨 REQUEST HELP CTA */}
          <RequestHelpButton variant="navbar" />

          {/* User Profile Avatar / Logout */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(d => !d)}
                aria-label="User menu"
                className="w-8 h-8 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-slate-200 hover:border-white/40 transition-colors"
              >
                <User className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel p-2 shadow-xl z-50 text-xs border border-white/15 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="font-semibold text-white truncate">
                      {'name' in currentUser ? currentUser.name : currentUser.orgName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <Link
                    to={role === 'ngo' ? '/ngo/profile' : '/profile'}
                    onClick={() => setDropdownOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  >
                    View Profile
                  </Link>
                  <Link
                    to={role === 'ngo' ? '/ngo/settings' : '/settings'}
                    onClick={() => setDropdownOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 flex items-center gap-2 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
