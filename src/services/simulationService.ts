import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase/config";

export async function runSimulation() {
  // Make sure Firebase is connected
  if (!db) {
    throw new Error(
      "Firebase is not configured. Check your .env file and VITE_USE_FIREBASE."
    );
  }

  // Get active emergency requests
  const emergencyQuery = query(
    collection(db, "emergency_requests"),
    where("status", "==", "active")
  );

  const emergencySnapshot = await getDocs(emergencyQuery);

  // Get responders
  const responderSnapshot = await getDocs(
    collection(db, "responders")
  );

  // Get resources
  const resourceSnapshot = await getDocs(
    collection(db, "resources")
  );

  // Get simulation settings
  const settingsSnapshot = await getDoc(
    doc(db, "simulation_settings", "default")
  );

  const settings = settingsSnapshot.exists()
    ? settingsSnapshot.data()
    : {
        simulationDurationMinutes: 30,
        criticalThresholdMinutes: 10,
        highThresholdMinutes: 20,
        responseTimeTargetMinutes: 10,
        criticalGrowthRate: 0.3,
        highGrowthRate: 0.2,
        mediumGrowthRate: 0.1,
        responderShortageThreshold: 2,
        resourceShortageThreshold: 0.2,
      };

  const emergencies = emergencySnapshot.docs.map((doc) => doc.data());
  const responders = responderSnapshot.docs.map((doc) => doc.data());
  const resources = resourceSnapshot.docs.map((doc) => doc.data());

  // --------------------------------
  // CURRENT EMERGENCY COUNTS
  // --------------------------------

  const currentCritical = emergencies.filter(
    (e) => e.severity === "critical"
  ).length;

  const currentHigh = emergencies.filter(
    (e) => e.severity === "high"
  ).length;

  const currentMedium = emergencies.filter(
    (e) => e.severity === "medium"
  ).length;

  // --------------------------------
  // PREDICT NEXT 30 MINUTES
  // --------------------------------

  const predictedCritical = Math.ceil(
    currentCritical * (1 + Number(settings.criticalGrowthRate || 0))
  );

  const predictedHigh = Math.ceil(
    currentHigh * (1 + Number(settings.highGrowthRate || 0))
  );

  const predictedMedium = Math.ceil(
    currentMedium * (1 + Number(settings.mediumGrowthRate || 0))
  );

  // --------------------------------
  // RESPONDER ANALYSIS
  // --------------------------------

  const availableResponders = responders.filter(
    (r) => r.status === "available"
  ).length;

  const busyResponders = responders.filter(
    (r) => r.status === "busy"
  ).length;

  const unassignedEmergencies = emergencies.filter(
    (e) => !e.assignedResponderId
  ).length;

  const responderShortage =
    availableResponders -
      predictedCritical <
    Number(settings.responderShortageThreshold || 2);

  // --------------------------------
  // RESOURCE ANALYSIS
  // --------------------------------

  const resourceStatus = resources.map((resource) => {
    const available = Number(
      resource.availableQuantity || 0
    );

    const threshold = Number(
      resource.lowStockThreshold || 0
    );

    return {
      type: resource.type,
      availableQuantity: available,
      lowStockThreshold: threshold,
      shortage: available <= threshold,
    };
  });

  const resourceShortages = resourceStatus.filter(
    (resource) => resource.shortage
  );

  // --------------------------------
  // RISK CALCULATION
  // --------------------------------

  let riskScore = 0;

  if (predictedCritical > currentCritical) {
    riskScore += 30;
  }

  if (predictedHigh > currentHigh) {
    riskScore += 20;
  }

  if (responderShortage) {
    riskScore += 30;
  }

  if (resourceShortages.length > 0) {
    riskScore += 20;
  }

  let riskLevel = "LOW";

  if (riskScore >= 60) {
    riskLevel = "HIGH";
  } else if (riskScore >= 30) {
    riskLevel = "MEDIUM";
  }

  // --------------------------------
  // RETURN SIMULATION RESULT
  // --------------------------------

  return {
    simulationDurationMinutes: Number(
      settings.simulationDurationMinutes || 30
    ),

    current: {
      critical: currentCritical,
      high: currentHigh,
      medium: currentMedium,
      availableResponders,
      busyResponders,
      unassignedEmergencies,
    },

    predicted: {
      critical: predictedCritical,
      high: predictedHigh,
      medium: predictedMedium,
    },

    responderAnalysis: {
      availableResponders,
      busyResponders,
      responderShortage,
    },

    resourceAnalysis: resourceStatus,

    resourceShortages,

    risk: {
      score: riskScore,
      level: riskLevel,
    },

    simulatedAt: new Date().toISOString(),
  };
}