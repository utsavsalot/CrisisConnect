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
  MapPin,
  LogIn,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { RequestHelpButton } from '../ui/RequestHelpButton';

export const Navbar: React.FC = () => {
  const { currentUser, role, isResponder, isAvailable, logout } = useAuth();
  const { unreadNotificationCount } = useEmergency();
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { label: 'Notifications', path: '/notifications', badgeCount: unreadNotificationCount },
    { label: 'Profile', path: '/profile' },
  ];

  const ngoNavLinks: NavLinkItem[] = [
    { label: 'Dashboard', path: '/ngo/dashboard' },
    { label: 'Requests', path: '/ngo/requests' },
    { label: 'Active Missions', path: '/ngo/active' },
    { label: 'Notifications', path: '/notifications', badgeCount: unreadNotificationCount },
  ];

  const adminNavLinks: NavLinkItem[] = [
    { label: 'Admin Dispatch', path: '/admin' },
    { label: 'Requests', path: '/ngo/requests' },
    { label: 'Notifications', path: '/notifications', badgeCount: unreadNotificationCount },
  ];

  const currentLinks = role === 'admin' 
    ? adminNavLinks 
    : role === 'ngo' 
      ? ngoNavLinks 
      : userNavLinks;

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-2xl transition-colors duration-200 ${isLanding ? 'border-black/10 bg-white/90' : 'border-[var(--border-color)] bg-[var(--bg-primary)]/85'}`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to={currentUser ? (role === 'ngo' ? '/ngo/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emergency-600/20 border border-emergency-500/40 flex items-center justify-center text-emergency-500 shadow-emergency-glow group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5 text-emergency-500" />
            </div>
            <div className="flex flex-col">
              <span className={`font-display text-lg font-black tracking-wider ${isLanding ? 'text-black' : 'text-theme-dark'}`}>
                CRISIS<span className="text-emergency-500">CONNECT</span>
              </span>
              <span className={`-mt-1 hidden text-[9px] font-semibold uppercase tracking-widest sm:block ${isLanding ? 'text-black/60' : 'text-theme-forest/80'}`}>
                Real-Time Emergency Network
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links for Desktop */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 lg:gap-2">
          {isPublic ? (
            <>
              <a href="/#how-it-works" className={`px-3 py-1.5 text-xs font-medium transition-colors ${isLanding ? 'text-black/70 hover:text-black' : 'text-theme-forest hover:text-theme-dark'}`}>
                How It Works
              </a>
              <a href="/#crisis-ai" className={`px-3 py-1.5 text-xs font-medium transition-colors ${isLanding ? 'text-black/70 hover:text-black' : 'text-theme-forest hover:text-theme-dark'}`}>
                CrisisAI
              </a>
              <a href="/#about" className={`px-3 py-1.5 text-xs font-medium transition-colors ${isLanding ? 'text-black/70 hover:text-black' : 'text-theme-forest hover:text-theme-dark'}`}>
                About Us
              </a>
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
                      ? 'text-theme-dark bg-white/10 border border-theme-mint/30 shadow-sm'
                      : 'text-theme-forest/80 hover:text-theme-dark/90 hover:bg-white/5'
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
                    <span className="w-4 h-4 rounded-full text-[10px] font-bold bg-emergency-500 text-theme-dark flex items-center justify-center">
                      {item.badgeCount}
                    </span>
                  )}
                </Link>
              );
            })
          )}
        </nav>

        {/* Right Section: Action CTA + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">

          <ThemeToggle />

          {/* When NOT logged in: Only the single primary Login button */}
          {!currentUser ? (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-emergency-600 hover:bg-emergency-500 text-theme-dark font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emergency-600/20 transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          ) : (
            /* When LOGGED IN: Show Dashboard link on landing (or Request Help inside app) + Profile Avatar */
            <>
              {isPublic ? (
                <Link
                  to={role === 'ngo' ? '/ngo/dashboard' : '/dashboard'}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-theme-dark font-semibold text-xs transition-all border border-theme-mint/40"
                >
                  Dashboard
                </Link>
              ) : (
                <RequestHelpButton variant="navbar" />
              )}

              {/* User Profile Avatar / Logout */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(d => !d)}
                  aria-label="User menu"
                  className="w-8 h-8 rounded-full bg-theme-sage border border-theme-mint/40 flex items-center justify-center text-theme-dark/90 hover:border-white/40 transition-colors"
                >
                  <User className="w-4 h-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel p-2 shadow-xl z-50 text-xs border border-theme-mint/40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-theme-mint/30">
                      <p className="font-semibold text-theme-dark truncate">
                        {'name' in currentUser ? currentUser.name : currentUser.orgName}
                      </p>
                      <p className="text-[10px] text-theme-forest/80 truncate">{currentUser.email}</p>
                    </div>
                    <Link
                      to={role === 'ngo' ? '/ngo/profile' : '/profile'}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-3 py-2 rounded-lg hover:bg-white/10 text-theme-forest hover:text-theme-dark"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={role === 'ngo' ? '/ngo/settings' : '/settings'}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-3 py-2 rounded-lg hover:bg-white/10 text-theme-forest hover:text-theme-dark"
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
            </>
          )}

          {/* Mobile menu toggle for public pages */}
          {isPublic && (
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-xl text-theme-forest/80 hover:text-theme-dark hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Landing Dropdown Menu */}
      {isPublic && mobileMenuOpen && (
        <div className="md:hidden border-b border-theme-mint/30 bg-theme-light/95 backdrop-blur-2xl px-6 py-4 flex flex-col gap-3 text-sm animate-in slide-in-from-top-2 duration-150">
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-theme-forest hover:text-theme-dark font-medium transition-colors border-b border-theme-mint/20"
          >
            How It Works
          </a>
          <a
            href="/#crisis-ai"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-theme-forest hover:text-theme-dark font-medium transition-colors border-b border-theme-mint/20"
          >
            CrisisAI
          </a>
          <a
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-theme-forest hover:text-theme-dark font-medium transition-colors"
          >
            About Us
          </a>
        </div>
      )}
    </header>
  );
};
