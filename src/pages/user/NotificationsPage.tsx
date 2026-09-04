import React from 'react';
import { Bell, CheckCheck, AlertTriangle, ShieldCheck, Activity, Info } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useEmergency();
  const { role } = useAuth();
  const requestPath = role === 'ngo' ? '/ngo/requests' : '/requests';

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
    <div className="min-h-screen bg-[#eef2f7] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-red-200 pb-4">
          <div>
            <h1 className="font-display text-2xl font-black text-slate-950">
              Notifications & Alerts
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Live status updates, nearby alerts, and coordination updates
            </p>
          </div>

          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 transition-colors hover:text-red-700"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="mx-auto mt-8 max-w-sm rounded-3xl border border-slate-200 bg-[#fffefa] p-12 text-center shadow-[0_14px_40px_rgba(15,23,42,0.10)]">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-200 bg-red-50">
              <Bell className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-sm font-bold text-black">You're up to date.</h3>
            <p className="mt-1 text-xs text-red-700">No pending notifications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`flex cursor-pointer items-start justify-between gap-4 rounded-2xl border p-4 shadow-[0_12px_30px_rgba(127,29,29,0.10)] transition-all ${
                  n.read
                    ? 'border-red-100 bg-[#fffdf8] opacity-70'
                    : 'border-red-200 bg-[#fffdf8] hover:border-red-400 hover:shadow-[0_16px_34px_rgba(127,29,29,0.15)]'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50">
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight text-slate-950">
                      {n.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-700">
                      {n.message}
                    </p>
                    <span className="mt-2 block font-mono text-[10px] text-slate-400">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {n.requestId && (
                  <Link
                    to={`${requestPath}/${n.requestId}`}
                    className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-red-700"
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
