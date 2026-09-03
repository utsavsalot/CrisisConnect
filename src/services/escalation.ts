import { EmergencyRequest, EscalationLevel } from '../types';

export const ESCALATION_STEPS: ReadonlyArray<{
  level: EscalationLevel;
  afterMinutes: number;
  radiusKm: number;
  label: string;
  action: string;
}> = [
  { level: 'local', afterMinutes: 0, radiusKm: 5, label: 'Local broadcast', action: 'Nearby capable responders and NGO hubs are being notified.' },
  { level: 'expanded', afterMinutes: 2, radiusKm: 15, label: 'Expanded broadcast', action: 'The search area has expanded and matching responders are being alerted again.' },
  { level: 'priority', afterMinutes: 5, radiusKm: 30, label: 'Priority dispatch', action: 'The incident is now priority and all matching partner NGOs are being notified.' },
  { level: 'admin_alerted', afterMinutes: 10, radiusKm: 50, label: 'Admin escalation', action: 'The emergency dispatch safety net has been alerted for intervention.' },
];

export const escalationIndex = (level: EscalationLevel | undefined) =>
  ESCALATION_STEPS.findIndex((step) => step.level === (level || 'local'));

export const getEscalationStep = (level: EscalationLevel | undefined) =>
  ESCALATION_STEPS.find((step) => step.level === (level || 'local')) || ESCALATION_STEPS[0];

export const getRequiredEscalation = (request: EmergencyRequest, now = Date.now()) => {
  if (request.status !== 'active') return getEscalationStep(request.escalationLevel);
  const ageInMinutes = (now - new Date(request.createdAt).getTime()) / 60_000;
  return [...ESCALATION_STEPS].reverse().find((step) => ageInMinutes >= step.afterMinutes) || ESCALATION_STEPS[0];
};

export const getMinutesUntilNextEscalation = (request: EmergencyRequest, now = Date.now()) => {
  if (request.status !== 'active') return null;
  const next = ESCALATION_STEPS[escalationIndex(request.escalationLevel) + 1];
  if (!next) return null;
  const ageInMinutes = (now - new Date(request.createdAt).getTime()) / 60_000;
  return Math.max(0, Math.ceil(next.afterMinutes - ageInMinutes));
};
