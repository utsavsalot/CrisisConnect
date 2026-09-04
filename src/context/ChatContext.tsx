import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import { chatService, requestService } from '../services/serviceManager';
import { useAuth } from './AuthContext';

interface ChatContextType {
  getMessages: (requestId: string) => ChatMessage[];
  sendMessage: (requestId: string, text: string) => Promise<ChatMessage>;
  subscribeToChat: (requestId: string, callback: (messages: ChatMessage[]) => void) => () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, role } = useAuth();
  const [, setTick] = useState(0);

  // Force component re-render on chat updates
  useEffect(() => {
    // Whenever any chat event fires, bump tick
    const handler = () => setTick(t => t + 1);
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const getMessages = useCallback((requestId: string): ChatMessage[] => {
    return chatService.getMessages(requestId);
  }, []);

  const sendMessage = useCallback(async (requestId: string, text: string): Promise<ChatMessage> => {
    if (!currentUser) throw new Error('Must be logged in to send message');
    const senderName = 'name' in currentUser ? currentUser.name : currentUser.orgName;
    
    let senderRole: 'user' | 'responder' | 'ngo' = 'user';
    if (role === 'ngo') {
      senderRole = 'ngo';
    } else {
      const req = requestService.getRequestById(requestId);
      if (req && req.requesterId === currentUser.uid) {
        senderRole = 'user';
      } else if (req && (req.acceptedBy === currentUser.uid || req.communityHelperId === currentUser.uid || ('responderMode' in currentUser && currentUser.responderMode))) {
        senderRole = 'responder';
      } else if ('responderMode' in currentUser && currentUser.responderMode) {
        senderRole = 'responder';
      }
    }

    const msg = await chatService.sendMessage(
      requestId,
      currentUser.uid,
      senderName,
      senderRole,
      text
    );
    setTick(t => t + 1);
    return msg;
  }, [currentUser, role]);

  const subscribeToChat = useCallback((requestId: string, callback: (messages: ChatMessage[]) => void) => {
    return chatService.onMessagesChanged(requestId, (msgs) => {
      callback(msgs);
      setTick(t => t + 1);
    });
  }, []);

  return (
    <ChatContext.Provider value={{ getMessages, sendMessage, subscribeToChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
