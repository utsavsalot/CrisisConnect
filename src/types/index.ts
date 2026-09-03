export type UserRole = 'user' | 'ngo' | 'admin';

export type EmergencyStatus = 'active' | 'accepted' | 'in_progress' | 'resolved';

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
  location: LocationCoordinates;
  verified: boolean;
  activeMissions: number;
  createdAt: string;
}

export interface EmergencyRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPhone?: string;
  requesterRole: 'user' | 'ngo';
  needs: EmergencyNeedCategory[];
  otherNeed?: string;
  description: string;
  location: LocationCoordinates;
  distanceKm?: number;
  status: EmergencyStatus;
  acceptedBy?: string;
  acceptedByName?: string;
  acceptedByType?: 'responder' | 'ngo';
  acceptedAt?: string;
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
