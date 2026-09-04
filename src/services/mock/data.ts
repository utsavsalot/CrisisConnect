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

export const INITIAL_REQUESTS: EmergencyRequest[] = [
  {
    id: 'req-101',
    requesterId: 'user-201',
    requesterName: 'Elena Rostova',
    requesterPhone: '+1 (555) 832-1982',
    requesterRole: 'user',
    needs: ['Medical Assistance', 'Medicine'],
    description: 'Severe asthma attack. Inhaler canister is empty and struggling to breathe. Cannot leave apartment due to severe dizziness.',
    location: {
      latitude: 40.7188,
      longitude: -73.9980,
      address: '142 Orchard St, Lower East Side, NY'
    },
    distanceKm: 0.9,
    status: 'active',
    medicalSeverity: 'critical',
    peopleAffected: 1,
    priorityScore: 92,
    priorityLevel: 'critical',
    priorityBreakdown: { emergencyType: 25, medicalSeverity: 25, peopleAffected: 3, waitingTime: 4, resourceScarcity: 5 },
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString() // 3 mins ago
  },
  {
    id: 'req-102',
    requesterId: 'user-202',
    requesterName: 'James Henderson',
    requesterPhone: '+1 (555) 472-8833',
    requesterRole: 'user',
    needs: ['Blood'],
    description: 'Urgent need for O-Negative whole blood for family member in localized clinic trauma stabilization.',
    location: {
      latitude: 40.7282,
      longitude: -73.9942,
      address: 'St. Marks Medical Clinic, East Village, NY'
    },
    distanceKm: 1.8,
    status: 'active',
    medicalSeverity: 'serious',
    peopleAffected: 1,
    priorityScore: 78,
    priorityLevel: 'high',
    priorityBreakdown: { emergencyType: 24, medicalSeverity: 18, peopleAffected: 3, waitingTime: 4, resourceScarcity: 5 },
    createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString() // 7 mins ago
  },
  {
    id: 'req-103',
    requesterId: 'user-203',
    requesterName: 'Maria & Robert Diaz',
    requesterPhone: '+1 (555) 671-3320',
    requesterRole: 'user',
    needs: ['Rescue', 'Transportation'],
    description: 'Basement apartment rapidly taking water from broken water main. Need evacuation assistance for mobility-impaired elderly relative.',
    location: {
      latitude: 40.7081,
      longitude: -74.0112,
      address: 'Battery Park City Residential Complex, NY'
    },
    distanceKm: 2.3,
    status: 'accepted',
    medicalSeverity: 'moderate',
    peopleAffected: 3,
    priorityScore: 65,
    priorityLevel: 'high',
    priorityBreakdown: { emergencyType: 22, medicalSeverity: 10, peopleAffected: 7, waitingTime: 8, resourceScarcity: 0 },
    acceptedBy: 'demo-ngo',
    acceptedByName: 'Metro Emergency Response & Red Cross',
    acceptedByType: 'ngo',
    acceptedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  },
  {
    id: 'req-104',
    requesterId: 'user-204',
    requesterName: 'David Kalu',
    requesterPhone: '+1 (555) 554-1299',
    requesterRole: 'user',
    needs: ['Food', 'Shelter', 'Water'],
    description: 'Displaced family of four following localized electrical fire. Warm shelter, dry clothing, and clean drinking water needed immediately.',
    location: {
      latitude: 40.7359,
      longitude: -73.9911,
      address: 'Gramercy Park North, NY'
    },
    distanceKm: 2.7,
    status: 'in_progress',
    medicalSeverity: 'low',
    peopleAffected: 4,
    priorityScore: 40,
    priorityLevel: 'medium',
    priorityBreakdown: { emergencyType: 12, medicalSeverity: 5, peopleAffected: 7, waitingTime: 12, resourceScarcity: 0 },
    acceptedBy: 'demo-responder',
    acceptedByName: 'Dr. Sarah Chen',
    acceptedByType: 'responder',
    acceptedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: 'req-105',
    requesterId: 'demo-user',
    requesterName: 'Alex Rivera',
    requesterPhone: '+1 (555) 234-5678',
    requesterRole: 'user',
    needs: ['Medicine'],
    description: 'Emergency insulin vial needed for elderly father isolated during localized storm conditions.',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '240 Mercer St, Greenwich Village, NY'
    },
    distanceKm: 0.1,
    status: 'resolved',
    medicalSeverity: 'serious',
    peopleAffected: 1,
    priorityScore: 80,
    priorityLevel: 'critical',
    priorityBreakdown: { emergencyType: 15, medicalSeverity: 18, peopleAffected: 3, waitingTime: 15, resourceScarcity: 5 },
    acceptedBy: 'demo-responder',
    acceptedByName: 'Dr. Sarah Chen',
    acceptedByType: 'responder',
    acceptedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString()
  },
  {
    id: 'req-106',
    requesterId: 'user-206',
    requesterName: 'Community Senior Center',
    requesterPhone: '+1 (555) 890-4422',
    requesterRole: 'ngo',
    needs: ['Transportation', 'Medical Assistance'],
    description: 'Power backup failure at assisted care center. Need accessible transit support to move 6 oxygen-dependent seniors.',
    location: {
      latitude: 40.7410,
      longitude: -74.0020,
      address: 'Chelsea Community Center, 8th Ave, NY'
    },
    distanceKm: 3.4,
    status: 'active',
    medicalSeverity: 'critical',
    peopleAffected: 6,
    priorityScore: 95,
    priorityLevel: 'critical',
    priorityBreakdown: { emergencyType: 25, medicalSeverity: 25, peopleAffected: 11, waitingTime: 12, resourceScarcity: 5 },
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString() // 42 mins ago - needs admin attention!
  }
];

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

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'demo-user',
    type: 'request_created',
    title: 'Emergency Request Active',
    message: 'Your emergency assistance request #req-105 is active. Nearby responders are being notified.',
    requestId: 'req-105',
    timestamp: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    read: true
  },
  {
    id: 'notif-2',
    userId: 'demo-user',
    type: 'request_accepted',
    title: 'Responder Assigned',
    message: 'Dr. Sarah Chen accepted your request and is en route with supplies.',
    requestId: 'req-105',
    timestamp: new Date(Date.now() - 1000 * 60 * 175).toISOString(),
    read: true
  },
  {
    id: 'notif-3',
    userId: 'demo-responder',
    type: 'request_created',
    title: 'New Nearby Emergency: Medical Assistance',
    message: 'Elena Rostova requested emergency asthma assistance 0.9 km away.',
    requestId: 'req-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    read: false
  },
  {
    id: 'notif-4',
    userId: 'demo-ngo',
    type: 'system_alert',
    title: 'Regional Flood Advisory Triage',
    message: 'Battery Park water main rupture reported. Multiple evacuations pending.',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    read: false
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'req-104': [
    {
      id: 'msg-1',
      requestId: 'req-104',
      senderId: 'demo-responder',
      senderName: 'Dr. Sarah Chen',
      senderRole: 'responder',
      text: 'Hello David, I have accepted your request. I am gathering thermal blankets, emergency dry rations, and clean water.',
      timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString()
    },
    {
      id: 'msg-2',
      requestId: 'req-104',
      senderId: 'user-204',
      senderName: 'David Kalu',
      senderRole: 'user',
      text: 'Thank you so much! We are standing on the sidewalk outside building 42. It is getting very cold.',
      timestamp: new Date(Date.now() - 1000 * 60 * 19).toISOString()
    },
    {
      id: 'msg-3',
      requestId: 'req-104',
      senderId: 'demo-responder',
      senderName: 'Dr. Sarah Chen',
      senderRole: 'responder',
      text: 'Hang tight, I am 4 blocks away in a silver Subaru with hazard lights on. ETA about 4 minutes.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString()
    }
  ],
  'req-103': [
    {
      id: 'msg-4',
      requestId: 'req-103',
      senderId: 'demo-ngo',
      senderName: 'Metro Response Dispatch',
      senderRole: 'ngo',
      text: 'Maria, this is Metro Relief Unit 2. Our rescue van with wheelchair ramp is en route to Battery Park complex.',
      timestamp: new Date(Date.now() - 1000 * 60 * 11).toISOString()
    }
  ]
};
