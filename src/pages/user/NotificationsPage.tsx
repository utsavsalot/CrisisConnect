import React from 'react';
import { Bell, CheckCheck, AlertTriangle, ShieldCheck, Activity, Info } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useEmergency();

  const getIcon = (type: string) => {
    switch (type) {
      case 'request_created':
        return <AlertTriangle className="w-4 h-4 text-emergency-500" />;
      case 'request_accepted':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'in_progress':
        return <Activity className="w-4 h-4 text-sky-400" />;
      default:
        return <Info className="w-4 h-4 text-theme-forest/80" />;
    }
  };

  return (
    <div className="min-h-screen bg-theme-light py-8 px-4 sm:px-6 lg:px-8 text-theme-dark">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between border-b border-theme-mint/30 pb-4">
          <div>
            <h1 className="text-2xl font-black text-theme-dark font-display">
              Notifications & Alerts
            </h1>
            <p className="text-xs text-theme-forest/80 mt-0.5">
              Live status updates, nearby alerts, and coordination updates
            </p>
          </div>

          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-theme-mint/30 max-w-sm mx-auto mt-8">
            <Bell className="w-8 h-8 text-theme-forest/60 mx-auto mb-3" />
            <h3 className="font-bold text-sm text-theme-dark">You're up to date.</h3>
            <p className="text-xs text-theme-forest/80 mt-1">No pending notifications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                  n.read
                    ? 'glass-panel border-theme-mint/20 opacity-75'
                    : 'glass-panel border-sky-500/30 bg-sky-500/[0.04]'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-theme-mint/30 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-theme-dark leading-tight">
                      {n.title}
                    </h4>
                    <p className="text-xs text-theme-forest mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-theme-forest/60 font-mono mt-2 block">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {n.requestId && (
                  <Link
                    to={`/requests/${n.requestId}`}
                    className="text-[11px] px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-theme-dark font-semibold shrink-0"
                  >
                    View
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
