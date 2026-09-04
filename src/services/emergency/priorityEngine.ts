import { EmergencyRequest, NGOResource, CrisisPriority, PriorityBreakdown, EmergencyNeedCategory } from '../../types';

const TYPE_SCORES: Record<string, number> = {
  'Medical Assistance': 25,
  'Blood': 24,
  'Oxygen': 23,
  'Rescue': 22,
  'Fire / Major Disaster': 22,
  'Medicine': 15,
  'Shelter': 12,
  'Food': 8,
  'Water': 8,
  'Transportation': 10,
  'Other': 5
};

export const calculateEmergencyTypeScore = (needs: EmergencyNeedCategory[]): number => {
  if (!needs || needs.length === 0) return 0;
  // Get the maximum score among all selected needs
  const scores = needs.map(need => TYPE_SCORES[need] || 5);
  return Math.max(...scores);
};

export const calculateSeverityScore = (severity?: 'low' | 'moderate' | 'serious' | 'critical' | null): number => {
  if (!severity) return 0;
  switch (severity) {
    case 'low': return 5;
    case 'moderate': return 10;
    case 'serious': return 18;
    case 'critical': return 25;
    default: return 0;
  }
};

export const calculatePeopleAffectedScore = (peopleAffected?: number): number => {
  if (!peopleAffected || peopleAffected < 1) return 0;
  if (peopleAffected === 1) return 3;
  if (peopleAffected >= 2 && peopleAffected <= 5) return 7;
  if (peopleAffected >= 6 && peopleAffected <= 20) return 11;
  return 15; // 20+ people
};

export const calculateWaitingTimeScore = (createdAt: string, nowMs: number): number => {
  const createdMs = new Date(createdAt).getTime();
  const diffMinutes = Math.max(0, (nowMs - createdMs) / (1000 * 60));

  if (diffMinutes < 5) return 0;
  if (diffMinutes < 15) return 4;
  if (diffMinutes < 30) return 8;
  if (diffMinutes < 60) return 12;
  return 15; // 60+ minutes
};

export const calculateResourceScarcityScore = (needs: EmergencyNeedCategory[], resources: NGOResource[]): number => {
  if (!needs || needs.length === 0 || !resources) return 0;
  
  // A simplistic check: see if we have resources matching the needs.
  let score = 0;
  
  for (const need of needs) {
    let matchedResources = resources;
    if (need === 'Blood') matchedResources = resources.filter(r => r.type.toLowerCase().includes('blood'));
    else if (need === 'Medicine' || need === 'Medical Assistance') matchedResources = resources.filter(r => r.type.toLowerCase().includes('medicine'));
    else if (need === 'Food') matchedResources = resources.filter(r => r.type.toLowerCase().includes('food'));
    else if (need === 'Shelter') matchedResources = resources.filter(r => r.type.toLowerCase().includes('shelter'));
    else if (need === 'Transportation' || need === 'Rescue') matchedResources = resources.filter(r => r.type.toLowerCase().includes('transportation') || r.type.toLowerCase().includes('vehicle'));
    else if (need === 'Water') matchedResources = resources.filter(r => r.type.toLowerCase().includes('water'));
    else continue;

    if (matchedResources.length === 0) {
      score = Math.max(score, 10);
      continue;
    }

    const totalAvailable = matchedResources.reduce((sum, r) => sum + r.available, 0);
    
    if (totalAvailable === 0) {
      score = Math.max(score, 10);
    } else if (totalAvailable < 50) { 
      score = Math.max(score, 5);
    } else {
      score = Math.max(score, 0);
    }
  }

  return score;
};

export const getPriorityLevel = (score: number): CrisisPriority => {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 35) return 'medium';
  return 'normal';
};

export interface PriorityResult {
  score: number;
  level: CrisisPriority;
  breakdown: PriorityBreakdown;
}

export const calculatePriority = (request: EmergencyRequest, resources: NGOResource[], nowMs: number = Date.now()): PriorityResult => {
  const timeToMeasure = (request.status === 'resolved' && request.resolvedAt) 
    ? new Date(request.resolvedAt).getTime() 
    : nowMs;

  const typeScore = calculateEmergencyTypeScore(request.needs);
  const severityScore = calculateSeverityScore(request.medicalSeverity);
  const peopleScore = calculatePeopleAffectedScore(request.peopleAffected);
  const waitingScore = calculateWaitingTimeScore(request.createdAt, timeToMeasure);
  const scarcityScore = calculateResourceScarcityScore(request.needs, resources);

  const rawScore = typeScore + severityScore + peopleScore + waitingScore + scarcityScore;
  
  const normalizedScore = Math.min(100, Math.max(0, Math.round((rawScore / 90) * 100)));

  return {
    score: normalizedScore,
    level: getPriorityLevel(normalizedScore),
    breakdown: {
      emergencyType: typeScore,
      medicalSeverity: severityScore,
      peopleAffected: peopleScore,
      waitingTime: waitingScore,
      resourceScarcity: scarcityScore
    }
  };
};
