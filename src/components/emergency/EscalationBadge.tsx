import React, { useEffect, useState } from 'react';
import { Siren } from 'lucide-react';
import { EmergencyRequest } from '../../types';
import { getEscalationStep, getMinutesUntilNextEscalation } from '../../services/escalation';

export const EscalationBadge: React.FC<{ request: EmergencyRequest; showCountdown?: boolean }> = ({ request, showCountdown = false }) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!showCountdown || request.status !== 'active') return;
    const timer = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, [request.status, showCountdown]);

  if (request.status !== 'active') return null;
  const step = getEscalationStep(request.escalationLevel);
  const minutes = getMinutesUntilNextEscalation(request, now);
  const tone = {
    local: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
    expanded: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    priority: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
    admin_alerted: 'border-emergency-500/30 bg-emergency-500/10 text-emergency-400',
  }[step.level];

  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${tone}`}><Siren className="h-3 w-3" />{step.label}{showCountdown && minutes !== null && <span>· next in {minutes}m</span>}</span>;
};
