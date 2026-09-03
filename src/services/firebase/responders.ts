import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { UserProfile, EmergencyNeedCategory } from '../../types';

export const firebaseResponderService = {
  async toggleResponderMode(userId: string, enabled: boolean): Promise<UserProfile> {
    if (!db) throw new Error('Firestore not initialized');
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, {
      responderMode: enabled,
      isAvailable: enabled
    });
    const snap = await getDoc(ref);
    return snap.data() as UserProfile;
  },

  async setAvailability(userId: string, isAvailable: boolean): Promise<UserProfile> {
    if (!db) throw new Error('Firestore not initialized');
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, { isAvailable });
    const snap = await getDoc(ref);
    return snap.data() as UserProfile;
  },

  async updateCapabilities(userId: string, capabilities: EmergencyNeedCategory[]): Promise<UserProfile> {
    if (!db) throw new Error('Firestore not initialized');
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, { capabilities });
    const snap = await getDoc(ref);
    return snap.data() as UserProfile;
  }
};
