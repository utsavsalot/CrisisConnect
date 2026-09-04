import { EmergencyRequest, UserProfile, NGOProfile, NGOResource, NotificationItem, ChatMessage } from '../../types';

export const INITIAL_USERS: Record<string, UserProfile> = {
  'demo-user': {
    uid: 'demo-user',
    name: 'Alex Rivera',
    email: 'alex@crisisconnect.org',
    phone: '+1 (555) 234-5678',
    role: 'user',
    responderMode: false,
    isAvailable: false,
    capabilities: [],
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '240 Mercer St, Greenwich Village, NY'
    },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  'demo-responder': {
    uid: 'demo-responder',
    name: 'Dr. Sarah Chen',
    email: 'sarah.responder@crisisconnect.org',
    phone: '+1 (555) 345-6789',
    role: 'user',
    responderMode: true,
    isAvailable: true,
    capabilities: ['Medical Assistance', 'Medicine', 'Blood', 'Rescue'],
    location: {
      latitude: 40.7209,
      longitude: -74.0007,
      address: 'SoHo District, New York, NY'
    },
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  'demo-admin': {
    uid: 'demo-admin',
    name: 'Marcus Vance',
    email: 'marcus.dispatch@crisisconnect.org',
    phone: '+1 (555) 987-6543',
    role: 'admin',
    responderMode: false,
    isAvailable: false,
    capabilities: [],
    location: {
      latitude: 40.7138,
      longitude: -74.0070,
      address: 'Civic Center Emergency Command, NY'
    },
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  }
};

export const INITIAL_NGOS: Record<string, NGOProfile> = {
  'demo-ngo': {
    uid: 'demo-ngo',
    orgName: 'Metro Emergency Response & Red Cross',
    email: 'operations@metrocrisisrelief.org',
    phone: '+1 (555) 911-4455',
    role: 'ngo',
    orgType: 'Humanitarian Disaster & Medical Relief',
    location: {
      latitude: 40.7306,
      longitude: -73.9352,
      address: 'Emergency Response Hub 4, Long Island City, NY'
    },
    verified: true,
    activeMissions: 3,
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString()
  }
};

export const INITIAL_REQUESTS: EmergencyRequest[] = [];

export const INITIAL_RESOURCES: NGOResource[] = [
  {
    id: 'res-1',
    ngoId: 'demo-ngo',
    type: 'Blood Units',
    available: 48,
    allocated: 16,
    total: 64,
    unit: 'Units (O-, A+, B+)',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'res-2',
    ngoId: 'demo-ngo',
    type: 'Medicines',
    available: 142,
    allocated: 38,
    total: 180,
    unit: 'Emergency Kits',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'res-3',
    ngoId: 'demo-ngo',
    type: 'Food Packages',
    available: 360,
    allocated: 90,
    total: 450,
    unit: 'High-Calorie Rations',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'res-4',
    ngoId: 'demo-ngo',
    type: 'Shelter Capacity',
    available: 72,
    allocated: 128,
    total: 200,
    unit: 'Available Cots/Beds',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'res-5',
    ngoId: 'demo-ngo',
    type: 'Transportation / Vehicles',
    available: 7,
    allocated: 5,
    total: 12,
    unit: 'Mobile Response Vans',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'res-6',
    ngoId: 'demo-ngo',
    type: 'Clean Water',
    available: 1450,
    allocated: 350,
    total: 1800,
    unit: 'Gallons Purified',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {};

