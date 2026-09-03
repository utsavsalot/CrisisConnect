import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase/config';

type Severity = 'critical' | 'high' | 'medium';

type Criticality = { id: string; score: number; severity: Severity; reasons: string[] };

const classifyRequest = (request: Record<string, unknown>, id: string): Criticality => {
  const needs = Array.isArray(request.needs) ? request.needs.map(String) : [];
  const description = String(request.description || '').toLowerCase();
  const reasons: string[] = [];
  let score = 10;
  const needWeights: Record<string, number> = {
    Rescue: 38, 'Medical Assistance': 34, Blood: 32, Medicine: 24,
    Transportation: 18, Shelter: 14, Water: 12, Food: 10, Other: 8,
  };
  needs.forEach((need) => { if (needWeights[need]) score += needWeights[need]; });
  if (needs.length > 1) { score += Math.min(12, (needs.length - 1) * 6); reasons.push('multiple needs reported'); }
  if (/breath|breathing|asthma|unconscious|unresponsive|bleed|bleeding|chest pain|heart attack|trapped|fire|drowning|severe|life.?threatening/.test(description)) {
    score += 28;
    reasons.push('life-threatening symptoms detected');
  } else if (/urgent|immediate|cannot breathe|emergency|critical|help now/.test(description)) {
    score += 12;
    reasons.push('urgent language detected');
  }
  const ageMinutes = request.createdAt ? Math.max(0, (Date.now() - new Date(String(request.createdAt)).getTime()) / 60000) : 0;
  if (ageMinutes >= 30) { score += 15; reasons.push('unassigned for over 30 minutes'); }
  else if (ageMinutes >= 10) { score += 8; reasons.push('waiting for over 10 minutes'); }
  if (!request.acceptedBy) reasons.push('no responder assigned');
  score = Math.min(100, score);
  const severity: Severity = score >= 70 ? 'critical' : score >= 45 ? 'high' : 'medium';
  if (reasons.length === 0) reasons.push('standard emergency need');
  return { id, score, severity, reasons };
};

const roundUp = (value: number) => Math.max(0, Math.ceil(value));

export async function runSimulation() {
  if (!db) throw new Error('Firebase is not configured. Check your .env file and VITE_USE_FIREBASE.');

  const [requestSnapshot, userSnapshot, resourceSnapshot, settingsSnapshot] = await Promise.all([
    getDocs(collection(db, 'emergencyRequests')),
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'resources')),
    getDoc(doc(db, 'simulation_settings', 'default')),
  ]);
  const settings = settingsSnapshot.exists() ? settingsSnapshot.data() : {};
  const activeRequests = requestSnapshot.docs.map((item) => ({ id: item.id, data: item.data() as Record<string, unknown> })).filter((request) => request.data.status === 'active');
  const criticality = activeRequests.map((request) => classifyRequest(request.data, request.id)).sort((a, b) => b.score - a.score);
  const users = userSnapshot.docs.map((item) => item.data() as Record<string, unknown>);
  const resources = resourceSnapshot.docs.map((item) => item.data() as Record<string, unknown>);

  const current = {
    critical: criticality.filter((request) => request.severity === 'critical').length,
    high: criticality.filter((request) => request.severity === 'high').length,
    medium: criticality.filter((request) => request.severity === 'medium').length,
    availableResponders: users.filter((user) => user.responderMode === true && user.isAvailable === true).length,
    unassignedEmergencies: activeRequests.filter((request) => !request.data.acceptedBy).length,
  };
  const withoutAction = {
    critical: roundUp(current.critical * (1 + Number(settings.criticalGrowthRate || 0.3))),
    high: roundUp(current.high * (1 + Number(settings.highGrowthRate || 0.2))),
    medium: roundUp(current.medium * (1 + Number(settings.mediumGrowthRate || 0.1))),
  };
  const resourceAnalysis = resources.map((resource) => {
    const available = Number(resource.available || resource.availableQuantity || 0);
    const threshold = Number(resource.lowStockThreshold || Math.max(1, Number(resource.total || available) * 0.2));
    return { type: String(resource.type || 'Resource'), availableQuantity: available, lowStockThreshold: threshold, shortage: available <= threshold };
  });
  const resourceShortages = resourceAnalysis.filter((resource) => resource.shortage);
  const medicineShortage = resourceShortages.some((resource) => /medic/i.test(resource.type));
  const responderShortage = current.availableResponders < Math.max(2, withoutAction.critical);
  const deployedResponders = Math.min(4, current.availableResponders);
  const baselineResponseTime = Math.max(8, roundUp((current.unassignedEmergencies / Math.max(1, current.availableResponders)) * 10));
  const riskScore = Math.min(100, (withoutAction.critical > current.critical ? 30 : 0) + (withoutAction.high > current.high ? 20 : 0) + (responderShortage ? 30 : 0) + (resourceShortages.length ? 20 : 0));

  return {
    simulationDurationMinutes: Number(settings.simulationDurationMinutes || 30),
    current,
    criticality,
    withoutAction,
    predicted: withoutAction,
    intervention: {
      responders: deployedResponders,
      zone: responderShortage ? 'Zone B' : 'priority zone',
      medicineKits: medicineShortage ? 10 : 0,
      resourceZone: 'Zone C',
      transportVehicles: Math.min(2, current.unassignedEmergencies),
      transportZone: 'Zone A',
    },
    expectedResult: {
      critical: Math.max(current.critical, withoutAction.critical - deployedResponders),
      high: Math.max(current.high, withoutAction.high - Math.max(0, deployedResponders - 1)),
      medium: withoutAction.medium,
      responseTimeBefore: baselineResponseTime + (responderShortage ? 8 : 3),
      responseTimeAfter: Math.max(5, baselineResponseTime - (deployedResponders ? 8 : 0)),
      medicineShortageBefore: medicineShortage,
      medicineShortageAfter: false,
    },
    responderAnalysis: { availableResponders: current.availableResponders, responderShortage },
    resourceAnalysis,
    resourceShortages,
    risk: { score: riskScore, level: riskScore >= 60 ? 'HIGH' : riskScore >= 30 ? 'MEDIUM' : 'LOW' },
    simulatedAt: new Date().toISOString(),
  };
}