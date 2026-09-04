export type UserRole = 'user' | 'ngo' | 'admin';

export type EmergencyStatus = 'active' | 'accepted' | 'in_progress' | 'resolved' | 'admin_escalated';

export type EscalationLevel = 'local' | 'expanded' | 'priority' | 'admin_alerted';

export type EmergencyNeedCategory = 
  | 'Blood'
  | 'Medicine'
  | 'Medical Assistance'
  | 'Food'
  | 'Shelter'
  | 'Transportation'
  | 'Rescue'
  | 'Water'
  | 'Other';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface FamilyMemberContact {
  relation: string;
  phone: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  responderMode: boolean;
  isAvailable: boolean;
  capabilities: EmergencyNeedCategory[];
  location: LocationCoordinates;
  createdAt: string;
  address?: string;
  gender?: string;
  age?: string | number;
  bloodGroup?: string;
  medicalHistory?: string[];
  emergencyContacts?: FamilyMemberContact[];
}

export interface NGOProfile {
  uid: string;
  orgName: string;
  email: string;
  phone: string;
  role: 'ngo';
  orgType: string;
  registrationId?: string;
  operatingArea?: string;
  emergencyServices?: EmergencyNeedCategory[];
  address?: string;
  location: LocationCoordinates;
  verified: boolean;
  activeMissions: number;
  createdAt: string;
}

export type CrisisPriority = 'critical' | 'high' | 'medium' | 'normal';

export interface PriorityBreakdown {
  emergencyType: number;
  medicalSeverity: number;
  peopleAffected: number;
  waitingTime: number;
  resourceScarcity: number;
}

export interface EmergencyRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterEmail?: string;
  requesterPhone?: string;
  requesterRole: 'user' | 'ngo';
  needs: EmergencyNeedCategory[];
  otherNeed?: string;
  description: string;
  location: LocationCoordinates;
  distanceKm?: number;
  status: EmergencyStatus;
  
  // Priority Engine Fields
  priorityScore?: number;
  priorityLevel?: CrisisPriority;
  medicalSeverity?: 'low' | 'moderate' | 'serious' | 'critical' | null;
  peopleAffected?: number;
  priorityBreakdown?: PriorityBreakdown;
  
  escalationLevel?: EscalationLevel;
  escalationRadiusKm?: number;
  escalatedAt?: string;
  adminEscalatedAt?: string;
  notifiedResponderIds?: string[];
  escalationHistory?: Array<{
    level: EscalationLevel;
    radiusKm: number;
    timestamp: string;
    event: string;
  }>;
  acceptedBy?: string;
  acceptedByName?: string;
  acceptedByType?: 'responder' | 'ngo';
  acceptedAt?: string;
  communityHelperId?: string;
  communityHelperName?: string;
  communityHelperAcceptedAt?: string;
  ngoResponderId?: string;
  ngoResponderName?: string;
  ngoAcceptedAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'responder' | 'ngo';
  text: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'request_created' | 'request_accepted' | 'in_progress' | 'request_resolved' | 'message' | 'system_alert';
  title: string;
  message: string;
  requestId?: string;
  timestamp: string;
  read: boolean;
}

export interface NGOResource {
  id: string;
  ngoId: string;
  type: 'Blood Units' | 'Medicines' | 'Food Packages' | 'Shelter Capacity' | 'Transportation / Vehicles' | 'Clean Water' | string;
  available: number;
  allocated: number;
  total: number;
  unit: string;
  updatedAt: string;
}

export interface CrisisCharacter {
  id: string;
  name: string;
  roleTitle: string;
  ghostWord: string;
  tagline: string;
  description: string;
  color: string;
  stats: string;
  iconName: string;
}
