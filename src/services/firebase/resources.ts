import { collection, doc, updateDoc, addDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from './config';
import { NGOResource } from '../../types';

export const firebaseResourceService = {
  getResources(_ngoId: string): NGOResource[] {
    return [];
  },

  async updateResource(id: string, available: number, allocated: number): Promise<void> {
    if (!db) return;
    const ref = doc(db, 'resources', id);
    await updateDoc(ref, {
      available,
      allocated,
      total: available + allocated,
      updatedAt: new Date().toISOString()
    });
  },

  async addResource(data: { ngoId: string; type: string; total: number; unit: string }): Promise<NGOResource> {
    if (!db) throw new Error('Firestore not initialized');
    const newRes: Omit<NGOResource, 'id'> = {
      ngoId: data.ngoId,
      type: data.type,
      available: data.total,
      allocated: 0,
      total: data.total,
      unit: data.unit,
      updatedAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'resources'), newRes);
    return { ...newRes, id: docRef.id };
  },

  onResourcesChanged(ngoId: string, callback: (res: NGOResource[]) => void) {
    if (!db) {
      callback([]);
      return () => {};
    }
    const q = query(collection(db, 'resources'), where('ngoId', '==', ngoId));
    return onSnapshot(q, (snapshot) => {
      const list: NGOResource[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...docSnap.data(), id: docSnap.id } as NGOResource);
      });
      callback(list);
    });
  }
};
