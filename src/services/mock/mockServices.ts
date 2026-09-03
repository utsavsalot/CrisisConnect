import { 
  UserProfile, 
  NGOProfile, 
  EmergencyRequest, 
  NGOResource, 
  NotificationItem, 
  ChatMessage, 
  EmergencyNeedCategory, 
  EmergencyStatus,
  LocationCoordinates 
} from '../../types';
import { 
  INITIAL_USERS, 
  INITIAL_NGOS, 
  INITIAL_REQUESTS, 
  INITIAL_RESOURCES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_MESSAGES 
} from './data';
import { ESCALATION_STEPS } from '../escalation';

type Listener = () => void;

class MockEventManager {
  private listeners: Map<string, Set<Listener>> = new Map();

  subscribe(event: string, listener: Listener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  emit(event: string) {
    this.listeners.get(event)?.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Event listener error:', err);
      }
    });
  }
}

export const eventBus = new MockEventManager();

// LocalStorage helpers
const STORAGE_PREFIX = 'crisisconnect_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

async function pullDevState<T>(key: string): Promise<T | null> {
  try {
    const response = await fetch(`/__crisisconnect/${key}?t=${Date.now()}`);
    if (!response.ok) return null;
    return await response.json() as T;
  } catch {
    return null;
  }
}

function pushDevState<T>(key: string, data: T): void {
  void fetch(`/__crisisconnect/${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => undefined);
}

// In-Memory state initialized with storage or data
let users: Record<string, UserProfile> = loadFromStorage('users', INITIAL_USERS);
let ngos: Record<string, NGOProfile> = loadFromStorage('ngos', INITIAL_NGOS);
let requests: EmergencyRequest[] = loadFromStorage('requests', INITIAL_REQUESTS);
let resources: NGOResource[] = loadFromStorage('resources', INITIAL_RESOURCES);
let notifications: NotificationItem[] = loadFromStorage('notifications', INITIAL_NOTIFICATIONS);
let messages: Record<string, ChatMessage[]> = loadFromStorage('messages', INITIAL_MESSAGES);
let currentUserId: string | null = loadFromStorage<string | null>('currentUserId', null);

const LOCAL_BROADCAST_RADIUS_KM = 5;

const distanceBetween = (first: LocationCoordinates, second: LocationCoordinates): number => {
  const latitude = ((second.latitude - first.latitude) * Math.PI) / 180;
  const longitude = ((second.longitude - first.longitude) * Math.PI) / 180;
  const latitudeOne = (first.latitude * Math.PI) / 180;
  const latitudeTwo = (second.latitude * Math.PI) / 180;
  const haversine = Math.sin(latitude / 2) ** 2
    + Math.sin(longitude / 2) ** 2 * Math.cos(latitudeOne) * Math.cos(latitudeTwo);

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const validLocation = (location: LocationCoordinates): boolean =>
  Number.isFinite(location.latitude) && Number.isFinite(location.longitude)
  && location.latitude >= -90 && location.latitude <= 90
  && location.longitude >= -180 && location.longitude <= 180;

const escalationDelayMinutes = (minutes: number): number => {
  if (import.meta.env.VITE_ESCALATION_TEST_MODE === 'true') {
    return minutes === 2 ? 10 / 60 : minutes === 5 ? 20 / 60 : 30 / 60;
  }
  return minutes;
};

const getEligibleResponderIds = (request: EmergencyRequest, radiusKm: number): string[] => {
  const responderIds = Object.values(users)
    .filter((user) => user.responderMode && user.isAvailable && distanceBetween(request.location, user.location) <= radiusKm)
    .filter((user) => user.capabilities.length === 0 || user.capabilities.some((capability) => request.needs.includes(capability) || capability === 'Other'))
    .map((user) => user.uid);
  const ngoIds = Object.values(ngos)
    .filter((ngo) => ngo.verified && distanceBetween(request.location, ngo.location) <= radiusKm)
    .filter((ngo) => !ngo.emergencyServices?.length || ngo.emergencyServices.some((service) => request.needs.includes(service) || service === 'Other'))
    .map((ngo) => ngo.uid);
  return [...responderIds, ...ngoIds];
};

const reconcileEscalations = (): void => {
  const now = Date.now();
  let changed = false;

  requests = requests.map((request) => {
    if (request.status !== 'active') return request;
    const elapsedMinutes = (now - new Date(request.createdAt).getTime()) / 60_000;
    const currentIndex = ESCALATION_STEPS.findIndex((step) => step.level === (request.escalationLevel || 'local'));
    const nextIndex = ESCALATION_STEPS.findIndex((step) => elapsedMinutes >= escalationDelayMinutes(step.afterMinutes));
    const targetIndex = Math.min(Math.max(nextIndex, 0), ESCALATION_STEPS.length - 1);
    if (targetIndex <= currentIndex) return request;

    const target = ESCALATION_STEPS[targetIndex];
    const history = [...(request.escalationHistory || [])];
    const previousRadius = request.escalationRadiusKm || 5;
    const notified = new Set(request.notifiedResponderIds || []);
    const newlyEligible = getEligibleResponderIds(request, target.radiusKm).filter((id) => !notified.has(id));
    newlyEligible.forEach((id) => {
      const responder = users[id] || ngos[id];
      void mockNotificationService.sendNotification({
        userId: id,
        type: 'request_created',
        title: `🚨 Search expanded to ${target.radiusKm} km`,
        message: `${request.needs.join(', ')} emergency is ${responder ? distanceBetween(request.location, responder.location).toFixed(1) : target.radiusKm} km away.`,
        requestId: request.id
      });
      notified.add(id);
    });

    changed = true;
    history.push({ level: target.level, radiusKm: target.radiusKm, timestamp: new Date().toISOString(), event: `No acceptance; search expanded to ${target.radiusKm} km.` });
    if (target.level === 'admin_alerted') {
      void mockNotificationService.sendNotification({
        userId: 'demo-admin',
        type: 'system_alert',
        title: '⚠️ Emergency escalated to admin',
        message: `${request.needs.join(', ')} request has had no accepted responder after the final search stage.`,
        requestId: request.id
      });
      return { ...request, status: 'admin_escalated', escalationLevel: target.level, escalationRadiusKm: previousRadius, escalatedAt: new Date().toISOString(), adminEscalatedAt: new Date().toISOString(), notifiedResponderIds: [...notified], escalationHistory: history };
    }
    return { ...request, escalationLevel: target.level, escalationRadiusKm: target.radiusKm, escalatedAt: new Date().toISOString(), notifiedResponderIds: [...notified], escalationHistory: history };
  });

  if (changed) {
    saveToStorage('requests', requests);
    pushDevState('requests', requests);
    eventBus.emit('requests_changed');
  }
};

export const mockAuthService = {
  getCurrentUser(): UserProfile | NGOProfile | null {
    if (currentUserId && users[currentUserId]) return users[currentUserId];
    if (currentUserId && ngos[currentUserId]) return ngos[currentUserId];
    return null;
  },

  async login(email: string, _pass: string): Promise<UserProfile | NGOProfile> {
    const userFound = Object.values(users).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (userFound) {
      currentUserId = userFound.uid;
      saveToStorage('currentUserId', currentUserId);
      eventBus.emit('auth_changed');
      return userFound;
    }
    const ngoFound = Object.values(ngos).find(n => n.email.toLowerCase() === email.toLowerCase());
    if (ngoFound) {
      currentUserId = ngoFound.uid;
      saveToStorage('currentUserId', currentUserId);
      eventBus.emit('auth_changed');
      return ngoFound;
    }
    // Default fallback to demo-user
    currentUserId = 'demo-user';
    saveToStorage('currentUserId', currentUserId);
    eventBus.emit('auth_changed');
    return users['demo-user'];
  },

  async signup(data: {
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'ngo';
    orgType?: string;
    location?: LocationCoordinates;
    registrationId?: string;
    operatingArea?: string;
    emergencyServices?: EmergencyNeedCategory[];
    address?: string;
  }): Promise<UserProfile | NGOProfile> {
    const uid = 'user-' + Date.now();
    const loc = data.location || { latitude: 40.7128, longitude: -74.0060, address: 'New York, NY' };
    
    if (data.role === 'ngo') {
      const newNgo: NGOProfile = {
        uid,
        orgName: data.name,
        email: data.email,
        phone: data.phone,
        role: 'ngo',
        orgType: data.orgType || 'Emergency Relief NGO',
        registrationId: data.registrationId,
        operatingArea: data.operatingArea,
        emergencyServices: data.emergencyServices,
        address: data.address,
        location: loc,
        verified: true,
        activeMissions: 0,
        createdAt: new Date().toISOString()
      };
      ngos[uid] = newNgo;
      currentUserId = uid;
      saveToStorage('ngos', ngos);
      saveToStorage('currentUserId', currentUserId);
      eventBus.emit('auth_changed');
      return newNgo;
    } else {
      const newUser: UserProfile = {
        uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'user',
        responderMode: false,
        isAvailable: false,
        capabilities: [],
        location: loc,
        createdAt: new Date().toISOString()
      };
      users[uid] = newUser;
      currentUserId = uid;
      saveToStorage('users', users);
      saveToStorage('currentUserId', currentUserId);
      eventBus.emit('auth_changed');
      return newUser;
    }
  },

  async logout(): Promise<void> {
    currentUserId = null;
    saveToStorage('currentUserId', null);
    eventBus.emit('auth_changed');
  },

  switchDemoAccount(accountKey: 'demo-user' | 'demo-responder' | 'demo-ngo' | 'demo-admin') {
    currentUserId = accountKey;
    saveToStorage('currentUserId', currentUserId);
    eventBus.emit('auth_changed');
    return this.getCurrentUser();
  },

  onAuthStateChanged(callback: (user: UserProfile | NGOProfile | null) => void) {
    callback(this.getCurrentUser());
    return eventBus.subscribe('auth_changed', () => {
      callback(this.getCurrentUser());
    });
  }
};

export const mockRequestService = {
  getAllRequests(): EmergencyRequest[] {
    reconcileEscalations();
    return [...requests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getMyRequests(userId: string): EmergencyRequest[] {
    return requests.filter(r => r.requesterId === userId || (r.acceptedBy === userId));
  },

  getNearbyRequests(userLocation?: LocationCoordinates, capabilities?: EmergencyNeedCategory[]): EmergencyRequest[] {
    // Return active requests filtered by capabilities if provided
    let list = requests.filter(r => r.status === 'active');
    if (capabilities && capabilities.length > 0) {
      list = list.filter(r => r.needs.some(n => capabilities.includes(n)) || r.needs.includes('Other'));
    }
    // Calculate approximate distance if location is provided
    return list.map(r => {
      if (userLocation && r.location) {
        const dLat = (r.location.latitude - userLocation.latitude) * 111;
        const dLon = (r.location.longitude - userLocation.longitude) * 85;
        const dist = Math.sqrt(dLat * dLat + dLon * dLon);
        return { ...r, distanceKm: parseFloat(dist.toFixed(1)) };
      }
      return r;
    });
  },

  getRequestById(id: string): EmergencyRequest | undefined {
    return requests.find(r => r.id === id);
  },

  async createRequest(data: {
    requesterId: string;
    requesterName: string;
    requesterPhone?: string;
    requesterRole: 'user' | 'ngo';
    needs: EmergencyNeedCategory[];
    otherNeed?: string;
    description: string;
    location: LocationCoordinates;
  }): Promise<EmergencyRequest> {
    if (!validLocation(data.location)) throw new Error('A valid emergency location is required');
    const newReq: EmergencyRequest = {
      id: 'req-' + Math.floor(1000 + Math.random() * 9000),
      requesterId: data.requesterId,
      requesterName: data.requesterName,
      requesterPhone: data.requesterPhone || '+1 (555) 000-HELP',
      requesterRole: data.requesterRole,
      needs: data.needs,
      otherNeed: data.otherNeed,
      description: data.description,
      location: data.location,
      distanceKm: 0.8,
      status: 'active',
        escalationLevel: 'local',
        escalationRadiusKm: 5,
        notifiedResponderIds: [],
        escalationHistory: [{ level: 'local', radiusKm: 5, timestamp: new Date().toISOString(), event: 'Request created; local dispatch started.' }],
      createdAt: new Date().toISOString()
    };
    const synced = await pullDevState<EmergencyRequest[]>('requests');
    if (synced) requests = synced;

    newReq.notifiedResponderIds = getEligibleResponderIds(newReq, LOCAL_BROADCAST_RADIUS_KM);
    requests = [newReq, ...requests];
    saveToStorage('requests', requests);
    pushDevState('requests', requests);

    Object.values(users)
      .filter((user) => user.responderMode && user.isAvailable && distanceBetween(data.location, user.location) <= LOCAL_BROADCAST_RADIUS_KM)
      .filter((user) => user.capabilities.length === 0 || user.capabilities.some((capability) => data.needs.includes(capability) || capability === 'Other'))
      .forEach((user) => {
        mockNotificationService.sendNotification({
          userId: user.uid,
          type: 'request_created',
          title: `🚨 Emergency: ${data.needs.join(', ')}`,
          message: `${data.requesterName} needs assistance ${distanceBetween(data.location, user.location).toFixed(1)} km away.`,
          requestId: newReq.id
        });
      });

    Object.values(ngos)
      .filter((ngo) => ngo.verified && distanceBetween(data.location, ngo.location) <= LOCAL_BROADCAST_RADIUS_KM)
      .forEach((ngo) => {
        mockNotificationService.sendNotification({
          userId: ngo.uid,
          type: 'request_created',
          title: `🚨 Triage Alert: ${data.needs.join(', ')}`,
          message: `New incident reported within ${LOCAL_BROADCAST_RADIUS_KM} km: ${data.description.substring(0, 50)}...`,
          requestId: newReq.id
        });
      });

    eventBus.emit('requests_changed');
    return newReq;
  },

  async acceptRequest(requestId: string, acceptedByUid: string, responderName: string, responderType: 'responder' | 'ngo'): Promise<EmergencyRequest> {
    const synced = await pullDevState<EmergencyRequest[]>('requests');
    if (synced) requests = synced;

    const idx = requests.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Request not found');

    requests[idx] = {
      ...requests[idx],
      status: 'accepted',
      acceptedBy: acceptedByUid,
      acceptedByName: responderName,
      acceptedByType: responderType,
      acceptedAt: new Date().toISOString()
    };

    saveToStorage('requests', requests);
    pushDevState('requests', requests);

    // Initial coordination greeting in chat
    mockChatService.sendMessage(requestId, acceptedByUid, responderName, responderType, 
      `Hello! I have accepted your request for assistance. I am preparing and heading to your location.`
    );

    // Notification for requester
    mockNotificationService.sendNotification({
      userId: requests[idx].requesterId,
      type: 'request_accepted',
      title: '🟢 Assistance Accepted',
      message: `${responderName} has accepted your request and is coordinating assistance.`,
      requestId
    });

    eventBus.emit('requests_changed');
    return requests[idx];
  },

  async updateStatus(requestId: string, status: EmergencyStatus): Promise<EmergencyRequest> {
    const synced = await pullDevState<EmergencyRequest[]>('requests');
    if (synced) requests = synced;

    const idx = requests.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Request not found');

    requests[idx] = {
      ...requests[idx],
      status,
      ...(status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {})
    };

    saveToStorage('requests', requests);
    pushDevState('requests', requests);

    mockNotificationService.sendNotification({
      userId: requests[idx].requesterId,
      type: status === 'resolved' ? 'request_resolved' : 'in_progress',
      title: status === 'resolved' ? '✓ Request Resolved' : '🤝 Assistance In Progress',
      message: status === 'resolved' 
        ? 'Your emergency assistance request has been marked as resolved.'
        : 'Assistance is currently in progress at your location.',
      requestId
    });

    eventBus.emit('requests_changed');
    return requests[idx];
  },

  onRequestsChanged(callback: (all: EmergencyRequest[]) => void) {
    callback(this.getAllRequests());
    const unsubscribeBus = eventBus.subscribe('requests_changed', () => {
      callback(this.getAllRequests());
    });
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_PREFIX + 'requests' || !event.newValue) return;
      try {
        requests = JSON.parse(event.newValue) as EmergencyRequest[];
        callback(this.getAllRequests());
      } catch {
      }
    };
    window.addEventListener('storage', handleStorage);
    const pollId = window.setInterval(() => {
      void pullDevState<EmergencyRequest[]>('requests').then((synced) => {
        if (synced) {
          const oldStr = JSON.stringify(requests);
          const newStr = JSON.stringify(synced);
          requests = synced;
          if (oldStr !== newStr) {
            callback(this.getAllRequests());
          }
        }
      });
    }, 1500);
    const escalationPollId = window.setInterval(() => {
      callback(this.getAllRequests());
    }, 1000);
    return () => {
      unsubscribeBus();
      window.removeEventListener('storage', handleStorage);
      window.clearInterval(pollId);
      window.clearInterval(escalationPollId);
    };
  }
};

export const mockResponderService = {
  async toggleResponderMode(userId: string, enabled: boolean): Promise<UserProfile> {
    if (users[userId]) {
      users[userId] = {
        ...users[userId],
        responderMode: enabled,
        isAvailable: enabled ? true : false
      };
      saveToStorage('users', users);
      eventBus.emit('auth_changed');
      return users[userId];
    }
    throw new Error('User not found');
  },

  async setAvailability(userId: string, isAvailable: boolean): Promise<UserProfile> {
    if (users[userId]) {
      users[userId] = {
        ...users[userId],
        isAvailable
      };
      saveToStorage('users', users);
      eventBus.emit('auth_changed');
      return users[userId];
    }
    throw new Error('User not found');
  },

  async updateCapabilities(userId: string, capabilities: EmergencyNeedCategory[]): Promise<UserProfile> {
    if (users[userId]) {
      users[userId] = {
        ...users[userId],
        capabilities
      };
      saveToStorage('users', users);
      eventBus.emit('auth_changed');
      return users[userId];
    }
    throw new Error('User not found');
  }
};

export const mockResourceService = {
  getResources(ngoId: string): NGOResource[] {
    return resources.filter(r => r.ngoId === ngoId || r.ngoId === 'demo-ngo');
  },

  async updateResource(id: string, available: number, allocated: number): Promise<NGOResource> {
    const idx = resources.findIndex(r => r.id === id);
    if (idx !== -1) {
      resources[idx] = {
        ...resources[idx],
        available,
        allocated,
        total: available + allocated,
        updatedAt: new Date().toISOString()
      };
      saveToStorage('resources', resources);
      eventBus.emit('resources_changed');
      return resources[idx];
    }
    throw new Error('Resource not found');
  },

  async addResource(data: { ngoId: string; type: string; total: number; unit: string }): Promise<NGOResource> {
    const newRes: NGOResource = {
      id: 'res-' + Date.now(),
      ngoId: data.ngoId,
      type: data.type,
      available: data.total,
      allocated: 0,
      total: data.total,
      unit: data.unit,
      updatedAt: new Date().toISOString()
    };
    resources = [...resources, newRes];
    saveToStorage('resources', resources);
    eventBus.emit('resources_changed');
    return newRes;
  },

  onResourcesChanged(ngoId: string, callback: (res: NGOResource[]) => void) {
    callback(this.getResources(ngoId));
    return eventBus.subscribe('resources_changed', () => {
      callback(this.getResources(ngoId));
    });
  }
};

export const mockChatService = {
  getMessages(requestId: string): ChatMessage[] {
    return messages[requestId] || [];
  },

  async sendMessage(requestId: string, senderId: string, senderName: string, senderRole: 'user' | 'responder' | 'ngo', text: string): Promise<ChatMessage> {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      requestId,
      senderId,
      senderName,
      senderRole,
      text,
      timestamp: new Date().toISOString()
    };

    const synced = await pullDevState<Record<string, ChatMessage[]>>('messages');
    if (synced) {
      messages = { ...messages, ...synced };
    }

    if (!messages[requestId]) {
      messages[requestId] = [];
    }
    messages[requestId] = [...messages[requestId], newMsg];
    saveToStorage('messages', messages);
    pushDevState('messages', messages);
    eventBus.emit('chat_' + requestId);
    return newMsg;
  },

  onMessagesChanged(requestId: string, callback: (msgs: ChatMessage[]) => void) {
    callback(this.getMessages(requestId));
    const unsubscribeBus = eventBus.subscribe('chat_' + requestId, () => {
      callback(this.getMessages(requestId));
    });
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_PREFIX + 'messages' || !event.newValue) return;
      try {
        messages = JSON.parse(event.newValue) as Record<string, ChatMessage[]>;
        callback(this.getMessages(requestId));
      } catch {
      }
    };
    window.addEventListener('storage', handleStorage);
    const pollId = window.setInterval(() => {
      void pullDevState<Record<string, ChatMessage[]>>('messages').then((synced) => {
        if (synced) {
          const oldStr = JSON.stringify(messages[requestId] || []);
          const newStr = JSON.stringify(synced[requestId] || []);
          messages = synced;
          if (oldStr !== newStr) {
            callback(this.getMessages(requestId));
          }
        }
      });
    }, 300);
    return () => {
      unsubscribeBus();
      window.removeEventListener('storage', handleStorage);
      window.clearInterval(pollId);
    };
  }
};

export const mockNotificationService = {
  getNotifications(userId: string): NotificationItem[] {
    return notifications
      .filter(n => n.userId === userId || n.userId === 'demo-user')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async sendNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): Promise<NotificationItem> {
    const newNotif: NotificationItem = {
      ...item,
      id: 'notif-' + Date.now(),
      timestamp: new Date().toISOString(),
      read: false
    };
    notifications = [newNotif, ...notifications];
    saveToStorage('notifications', notifications);
    eventBus.emit('notifications_changed');
    return newNotif;
  },

  async markAsRead(id: string): Promise<void> {
    const idx = notifications.findIndex(n => n.id === id);
    if (idx !== -1) {
      notifications[idx].read = true;
      saveToStorage('notifications', notifications);
      eventBus.emit('notifications_changed');
    }
  },

  async markAllAsRead(userId: string): Promise<void> {
    notifications = notifications.map(n => n.userId === userId ? { ...n, read: true } : n);
    saveToStorage('notifications', notifications);
    eventBus.emit('notifications_changed');
  },

  onNotificationsChanged(userId: string, callback: (items: NotificationItem[]) => void) {
    callback(this.getNotifications(userId));
    return eventBus.subscribe('notifications_changed', () => {
      callback(this.getNotifications(userId));
    });
  }
};
