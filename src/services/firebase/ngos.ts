import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { NGOProfile } from '../../types';

export const firebaseNGOService = {
  async getNGOProfile(ngoId: string): Promise<NGOProfile | null> {
    if (!db) return null;
    const snap = await getDoc(doc(db, 'ngos', ngoId));
    return snap.exists() ? (snap.data() as NGOProfile) : null;
  },

  async updateActiveMissions(ngoId: string, delta: number): Promise<void> {
    if (!db) return;
    const ref = doc(db, 'ngos', ngoId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const current = snap.data().activeMissions || 0;
      await updateDoc(ref, { activeMissions: Math.max(0, current + delta) });
    }
  }
};
