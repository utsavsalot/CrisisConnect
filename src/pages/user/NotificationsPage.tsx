import React from 'react';
import { Bell, CheckCheck, AlertTriangle, ShieldCheck, Activity, Info, Heart } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useEmergency();
  const { role } = useAuth();

  const isVolunteerAlert = (n: { title: string; message: string; type: string }) => {
    const text = `${n.title} ${n.message}`.toLowerCase();
    return (
      text.includes('emergency nearby') ||
      text.includes('search expanded') ||
      text.includes('offer help') ||
      text.includes('volunteer') ||
      text.includes('community helper')
    );
  };

  const getIcon = (n: { title: string; message: string; type: string }) => {
    if (isVolunteerAlert(n)) {
      return <Heart className="w-4 h-4 text-red-600" />;
    }
    switch (n.type) {
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
    <div className="min-h-screen bg-[#f4f5f8] px-4 py-8 text-black sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-black/15 pb-4">
          <div>
            <h1 className="font-display text-2xl font-black text-black">
              Notifications & Alerts
            </h1>
            <p className="mt-0.5 text-xs text-black/60">
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
            {notifications.map((n) => {
              const isVol = isVolunteerAlert(n);
              return (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`flex cursor-pointer items-start justify-between gap-4 rounded-2xl border p-4 transition-all ${
                    n.read
                      ? 'border-black/10 bg-white/70 opacity-70'
                      : isVol
                        ? 'border-red-500/40 bg-red-50/40 shadow-sm'
                        : 'border-black/15 bg-white shadow-sm hover:border-black/30'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                      isVol ? 'border-red-200 bg-red-50 text-red-600' : 'border-black/10 bg-[#f4f5f8]'
                    }`}>
                      {getIcon(n)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-xs font-bold leading-tight text-black">
                          {n.title}
                        </h4>
                        {isVol && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-600">
                            🤝 Volunteer Alert
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-black/70">
                        {n.message}
                      </p>
                      <span className="mt-2 block font-mono text-[10px] text-black/50">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {n.requestId && (
                    <Link
                      to={role === 'ngo' ? `/ngo/requests/${n.requestId}` : `/requests/${n.requestId}`}
                      className="shrink-0 rounded-xl bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-red-700"
                    >
                      View
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
