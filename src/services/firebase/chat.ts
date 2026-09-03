import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './config';
import { ChatMessage } from '../../types';

export const firebaseChatService = {
  getMessages(_requestId: string): ChatMessage[] {
    return [];
  },

  async sendMessage(
    requestId: string,
    senderId: string,
    senderName: string,
    senderRole: 'user' | 'responder' | 'ngo',
    text: string
  ): Promise<ChatMessage> {
    if (!db) throw new Error('Firestore not initialized');

    const newMsg: Omit<ChatMessage, 'id'> = {
      requestId,
      senderId,
      senderName,
      senderRole,
      text,
      timestamp: new Date().toISOString()
    };

    const docRef = await addDoc(
      collection(db, 'messages', requestId, 'messages'),
      newMsg
    );
    return { ...newMsg, id: docRef.id };
  },

  onMessagesChanged(requestId: string, callback: (msgs: ChatMessage[]) => void) {
    if (!db) {
      callback([]);
      return () => {};
    }
    const q = query(
      collection(db, 'messages', requestId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach(docSnap => {
        msgs.push({ ...docSnap.data(), id: docSnap.id } as ChatMessage);
      });
      callback(msgs);
    });
  }
};
