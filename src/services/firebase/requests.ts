import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy,
  runTransaction
} from 'firebase/firestore';
import { db } from './config';
import { EmergencyRequest, EmergencyNeedCategory, EmergencyStatus, LocationCoordinates } from '../../types';
import { firebaseNotificationService } from './notifications';

let cachedRequests: EmergencyRequest[] = [];

const distanceBetween = (first: LocationCoordinates, second: LocationCoordinates): number => {
  const latitude = ((second.latitude - first.latitude) * Math.PI) / 180;
  const longitude = ((second.longitude - first.longitude) * Math.PI) / 180;
  const firstLatitude = (first.latitude * Math.PI) / 180;
  const secondLatitude = (second.latitude * Math.PI) / 180;
  const haversine = Math.sin(latitude / 2) ** 2
    + Math.sin(longitude / 2) ** 2 * Math.cos(firstLatitude) * Math.cos(secondLatitude);
  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const validLocation = (location: LocationCoordinates): boolean =>
  Number.isFinite(location.latitude) && Number.isFinite(location.longitude)
  && location.latitude >= -90 && location.latitude <= 90
  && location.longitude >= -180 && location.longitude <= 180;

export const firebaseRequestService = {
  getAllRequests(): EmergencyRequest[] {
    return cachedRequests;
  },

  getMyRequests(userId: string): EmergencyRequest[] {
    return cachedRequests.filter(r => r.requesterId === userId || r.acceptedBy === userId);
  },

  getNearbyRequests(userLocation?: LocationCoordinates, capabilities?: EmergencyNeedCategory[]): EmergencyRequest[] {
    let list = cachedRequests.filter(r => r.status === 'active');
    if (userLocation) {
      list = list.filter((request) => distanceBetween(request.location, userLocation) <= (request.escalationRadiusKm || 5));
    }
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
    if (!validLocation(data.location)) throw new Error('A valid emergency location is required');

    const newReqData: Omit<EmergencyRequest, 'id'> = {
      requesterId: data.requesterId,
      requesterName: data.requesterName,
      requesterRole: data.requesterRole,
      needs: data.needs,
      description: data.description,
      location: data.location,
      status: 'active',
      escalationLevel: 'local',
      escalationRadiusKm: 5,
      notifiedResponderIds: [],
      escalationHistory: [{ level: 'local', radiusKm: 5, timestamp: new Date().toISOString(), event: 'Request created; local dispatch started.' }],
      createdAt: new Date().toISOString(),
      ...(data.requesterPhone ? { requesterPhone: data.requesterPhone } : {}),
      ...(data.otherNeed ? { otherNeed: data.otherNeed } : {})
    };

    const docRef = await addDoc(collection(db, 'emergencyRequests'), newReqData);
    const created = { ...newReqData, id: docRef.id };
    const ngosSnapshot = await getDocs(collection(db, 'ngos'));
    await Promise.all([
      firebaseNotificationService.sendNotification({
        userId: data.requesterId,
        type: 'request_created',
        title: 'SOS request sent',
        message: 'Your emergency request is active and being broadcast to verified responders.',
        requestId: docRef.id,
      }),
      ...ngosSnapshot.docs
        .filter((ngo) => ngo.data().verified !== false)
        .map((ngo) => firebaseNotificationService.sendNotification({
          userId: ngo.id,
          type: 'request_created',
          title: 'New emergency SOS nearby',
          message: `${data.requesterName} needs ${data.needs.join(', ')}. Open the request to review and respond.`,
          requestId: docRef.id,
        })),
    ]);
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
    const acceptedAt = new Date().toISOString();
    const updates = {
      status: 'accepted' as EmergencyStatus,
      acceptedBy: acceptedByUid,
      acceptedByName: responderName,
      acceptedByType: responderType,
      acceptedAt
    };
    let target: EmergencyRequest | undefined;
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists()) throw new Error('Request not found');
      target = { ...snapshot.data(), id: snapshot.id } as EmergencyRequest;
      if (target.status !== 'active' || target.acceptedBy) throw new Error('Request has already been assigned');
      transaction.update(ref, updates);
    });

    await firebaseNotificationService.sendNotification({
      userId: target!.requesterId,
      type: 'request_accepted',
      title: 'Assistance accepted',
      message: `${responderName} accepted your emergency request. Open it to coordinate in chat.`,
      requestId,
    });

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
