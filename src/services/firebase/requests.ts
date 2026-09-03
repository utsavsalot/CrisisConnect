import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './config';
import { EmergencyRequest, EmergencyNeedCategory, EmergencyStatus, LocationCoordinates } from '../../types';

let cachedRequests: EmergencyRequest[] = [];

export const firebaseRequestService = {
  getAllRequests(): EmergencyRequest[] {
    return cachedRequests;
  },

  getMyRequests(userId: string): EmergencyRequest[] {
    return cachedRequests.filter(r => r.requesterId === userId || r.acceptedBy === userId);
  },

  getNearbyRequests(userLocation?: LocationCoordinates, capabilities?: EmergencyNeedCategory[]): EmergencyRequest[] {
    let list = cachedRequests.filter(r => r.status === 'active');
    if (capabilities && capabilities.length > 0) {
      list = list.filter(r => r.needs.some(n => capabilities.includes(n)) || r.needs.includes('Other'));
    }
    return list;
  },

  getRequestById(id: string): EmergencyRequest | undefined {
    return cachedRequests.find(r => r.id === id);
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
    if (!db) throw new Error('Firestore not initialized');

    const newReqData: Omit<EmergencyRequest, 'id'> = {
      requesterId: data.requesterId,
      requesterName: data.requesterName,
      requesterPhone: data.requesterPhone,
      requesterRole: data.requesterRole,
      needs: data.needs,
      otherNeed: data.otherNeed,
      description: data.description,
      location: data.location,
      distanceKm: 1.2,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'emergencyRequests'), newReqData);
    const created = { ...newReqData, id: docRef.id };
    return created;
  },

  async acceptRequest(
    requestId: string,
    acceptedByUid: string,
    responderName: string,
    responderType: 'responder' | 'ngo'
  ): Promise<EmergencyRequest> {
    if (!db) throw new Error('Firestore not initialized');
    const ref = doc(db, 'emergencyRequests', requestId);
    const updates = {
      status: 'accepted' as EmergencyStatus,
      acceptedBy: acceptedByUid,
      acceptedByName: responderName,
      acceptedByType: responderType,
      acceptedAt: new Date().toISOString()
    };
    await updateDoc(ref, updates);

    const target = cachedRequests.find(r => r.id === requestId);
    return target ? { ...target, ...updates } : ({} as EmergencyRequest);
  },

  async updateStatus(requestId: string, status: EmergencyStatus): Promise<EmergencyRequest> {
    if (!db) throw new Error('Firestore not initialized');
    const ref = doc(db, 'emergencyRequests', requestId);
    const updates = {
      status,
      ...(status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {})
    };
    await updateDoc(ref, updates);
    const target = cachedRequests.find(r => r.id === requestId);
    return target ? { ...target, ...updates } : ({} as EmergencyRequest);
  },

  onRequestsChanged(callback: (all: EmergencyRequest[]) => void) {
    if (!db) {
      callback([]);
      return () => {};
    }
    const q = query(collection(db, 'emergencyRequests'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const all: EmergencyRequest[] = [];
      snapshot.forEach(docSnap => {
        all.push({ ...docSnap.data(), id: docSnap.id } as EmergencyRequest);
      });
      cachedRequests = all;
      callback(all);
    }, (err) => {
      console.warn('Firestore onRequestsChanged error:', err);
    });
  }
};
