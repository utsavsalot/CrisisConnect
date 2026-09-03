import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListOrdered, Shield, Bell, User, MapPin, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { RequestHelpButton } from '../ui/RequestHelpButton';

export const MobileNav: React.FC = () => {
  const { currentUser, role } = useAuth();
  const { unreadNotificationCount } = useEmergency();
  const location = useLocation();

  if (!currentUser || location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const userItems = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'Requests', icon: ListOrdered, path: '/requests' },
    { label: 'Responder', icon: Shield, path: '/responder' },
    { label: 'Alerts', icon: Bell, path: '/notifications', count: unreadNotificationCount },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  const ngoItems = [
    { label: 'HQ', icon: Home, path: '/ngo/dashboard' },
    { label: 'Triage', icon: ListOrdered, path: '/ngo/requests' },
    { label: 'Map', icon: MapPin, path: '/ngo/map' },
    { label: 'Resources', icon: Package, path: '/ngo/resources' },
    { label: 'Alerts', icon: Bell, path: '/notifications', count: unreadNotificationCount },
  ];

  const items = role === 'ngo' ? ngoItems : userItems;

  return (
    <>
      {/* Floating emergency CTA for mobile */}
      <RequestHelpButton variant="floating" />

      {/* Bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070B14]/90 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around">
        {items.map((it) => {
          const active = location.pathname === it.path;
          const Icon = it.icon;
          return (
            <Link
              key={it.path}
              to={it.path}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition-colors relative ${
                active ? 'text-emergency-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{it.label}</span>
              {typeof it.count === 'number' && it.count > 0 && (
                <span className="absolute top-1 right-2 w-3.5 h-3.5 rounded-full bg-emergency-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {it.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
};
