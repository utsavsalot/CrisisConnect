import { EmergencyRequest, EscalationLevel } from '../types';

export const ESCALATION_STEPS: ReadonlyArray<{
  level: EscalationLevel;
  afterMinutes: number;
  radiusKm: number;
  label: string;
  action: string;
}> = [
  { level: 'local', afterMinutes: 0, radiusKm: 5, label: 'Local broadcast', action: 'Nearby capable responders and NGO hubs are being notified.' },
  { level: 'expanded', afterMinutes: 2, radiusKm: 10, label: '10 km broadcast', action: 'The search area has expanded and matching responders are being alerted again.' },
  { level: 'priority', afterMinutes: 5, radiusKm: 15, label: '15 km broadcast', action: 'The search area has expanded to 15 km and matching partners are being notified.' },
  { level: 'admin_alerted', afterMinutes: 7, radiusKm: 15, label: 'Admin escalation', action: 'The emergency dispatch safety net has been alerted for intervention.' },
];

export const escalationIndex = (level: EscalationLevel | undefined) =>
  ESCALATION_STEPS.findIndex((step) => step.level === (level || 'local'));

export const getStageAfterMinutes = (minutes: number): number => {
  if (import.meta.env.VITE_ESCALATION_TEST_MODE === 'true') {
    return minutes === 2 ? 10 / 60 : minutes === 5 ? 20 / 60 : 30 / 60;
  }
  return minutes;
};

export const getEscalationStep = (level: EscalationLevel | undefined) =>
  ESCALATION_STEPS.find((step) => step.level === (level || 'local')) || ESCALATION_STEPS[0];

export const getRequiredEscalation = (request: EmergencyRequest, now = Date.now()) => {
  if (request.status !== 'active') return getEscalationStep(request.escalationLevel);
  const ageInMinutes = (now - new Date(request.createdAt).getTime()) / 60_000;
  return [...ESCALATION_STEPS].reverse().find((step) => ageInMinutes >= getStageAfterMinutes(step.afterMinutes)) || ESCALATION_STEPS[0];
};

export const getSecondsUntilNextEscalation = (request: EmergencyRequest, now = Date.now()) => {
  if (request.status !== 'active') return null;
  const next = ESCALATION_STEPS[escalationIndex(request.escalationLevel) + 1];
  if (!next) return null;
  const nextAt = new Date(request.createdAt).getTime() + getStageAfterMinutes(next.afterMinutes) * 60_000;
  return Math.max(0, Math.ceil((nextAt - now) / 1000));
};

export const getMinutesUntilNextEscalation = (request: EmergencyRequest, now = Date.now()) => {
  const seconds = getSecondsUntilNextEscalation(request, now);
  return seconds === null ? null : Math.ceil(seconds / 60);
};
