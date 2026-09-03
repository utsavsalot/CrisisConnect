import { collection, addDoc, updateDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
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
    // Client-side batch or individual update
  },

  onNotificationsChanged(userId: string, callback: (items: NotificationItem[]) => void) {
    if (!db) {
      callback([]);
      return () => {};
    }
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const notifs: NotificationItem[] = [];
      snapshot.forEach(docSnap => {
        notifs.push({ ...docSnap.data(), id: docSnap.id } as NotificationItem);
      });
      callback(notifs);
    });
  }
};
