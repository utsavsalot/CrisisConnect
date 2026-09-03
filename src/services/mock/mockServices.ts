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

// In-Memory state initialized with storage or data
let users: Record<string, UserProfile> = loadFromStorage('users', INITIAL_USERS);
let ngos: Record<string, NGOProfile> = loadFromStorage('ngos', INITIAL_NGOS);
let requests: EmergencyRequest[] = loadFromStorage('requests', INITIAL_REQUESTS);
let resources: NGOResource[] = loadFromStorage('resources', INITIAL_RESOURCES);
let notifications: NotificationItem[] = loadFromStorage('notifications', INITIAL_NOTIFICATIONS);
let messages: Record<string, ChatMessage[]> = loadFromStorage('messages', INITIAL_MESSAGES);
let currentUserId: string | null = loadFromStorage<string | null>('currentUserId', null);

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
      createdAt: new Date().toISOString()
    };

    requests = [newReq, ...requests];
    saveToStorage('requests', requests);

    // Also trigger notification for responders & NGOs
    mockNotificationService.sendNotification({
      userId: 'demo-responder',
      type: 'request_created',
      title: `🚨 Emergency: ${data.needs.join(', ')}`,
      message: `${data.requesterName} needs immediate assistance near ${data.location.address || 'your area'}.`,
      requestId: newReq.id
    });

    mockNotificationService.sendNotification({
      userId: 'demo-ngo',
      type: 'request_created',
      title: `🚨 Triage Alert: ${data.needs.join(', ')}`,
      message: `New incident reported: ${data.description.substring(0, 50)}...`,
      requestId: newReq.id
    });

    eventBus.emit('requests_changed');
    return newReq;
  },

  async acceptRequest(requestId: string, acceptedByUid: string, responderName: string, responderType: 'responder' | 'ngo'): Promise<EmergencyRequest> {
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
    const idx = requests.findIndex(r => r.id === requestId);
    if (idx === -1) throw new Error('Request not found');

    requests[idx] = {
      ...requests[idx],
      status,
      ...(status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {})
    };

    saveToStorage('requests', requests);

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
    return eventBus.subscribe('requests_changed', () => {
      callback(this.getAllRequests());
    });
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

    if (!messages[requestId]) {
      messages[requestId] = [];
    }
    messages[requestId] = [...messages[requestId], newMsg];
    saveToStorage('messages', messages);
    eventBus.emit('chat_' + requestId);
    return newMsg;
  },

  onMessagesChanged(requestId: string, callback: (msgs: ChatMessage[]) => void) {
    callback(this.getMessages(requestId));
    return eventBus.subscribe('chat_' + requestId, () => {
      callback(this.getMessages(requestId));
    });
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
