import { collection, addDoc, updateDoc, doc, onSnapshot, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './config';
import { NotificationItem } from '../../types';

export const firebaseNotificationService = {
  getNotifications(_userId: string): NotificationItem[] {
    return [];
  },

  async sendNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): Promise<NotificationItem> {
    if (!db) throw new Error('Firestore not initialized');
    const newNotif = {
      ...item,
      timestamp: new Date().toISOString(),
      read: false
    };
    const docRef = await addDoc(collection(db, 'notifications'), newNotif);
    return { ...newNotif, id: docRef.id };
  },

  async markAsRead(id: string): Promise<void> {
    if (!db) return;
    await updateDoc(doc(db, 'notifications', id), { read: true });
  },

  async markAllAsRead(userId: string): Promise<void> {
    if (!db) return;
    const snapshot = await getDocs(query(collection(db, 'notifications'), where('userId', '==', userId), where('read', '==', false)));
    const batch = writeBatch(db);
    snapshot.forEach((item) => batch.update(item.ref, { read: true }));
    await batch.commit();
  },

  onNotificationsChanged(userId: string, callback: (items: NotificationItem[]) => void) {
    if (!db) {
      callback([]);
      return () => {};
    }
    const q = query(collection(db, 'notifications'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const notifs: NotificationItem[] = [];
      snapshot.forEach(docSnap => {
        notifs.push({ ...docSnap.data(), id: docSnap.id } as NotificationItem);
      });
      callback(notifs.sort((first, second) => new Date(second.timestamp).getTime() - new Date(first.timestamp).getTime()));
    }, (error) => {
      console.warn('Firebase notification subscription error:', error);
      callback([]);
    });
  }
};
