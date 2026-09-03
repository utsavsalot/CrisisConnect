import { isFirebaseConfigured } from './firebase/config';
import {
  mockAuthService,
  mockRequestService,
  mockResponderService,
  mockResourceService,
  mockChatService,
  mockNotificationService
} from './mock/mockServices';

import { firebaseAuthService } from './firebase/auth';
import { firebaseRequestService } from './firebase/requests';
import { firebaseResponderService } from './firebase/responders';
import { firebaseResourceService } from './firebase/resources';
import { firebaseChatService } from './firebase/chat';
import { firebaseNotificationService } from './firebase/notifications';

export const authService = isFirebaseConfigured ? firebaseAuthService : mockAuthService;
export const requestService = isFirebaseConfigured ? firebaseRequestService : mockRequestService;
export const responderService = isFirebaseConfigured ? firebaseResponderService : mockResponderService;
export const resourceService = isFirebaseConfigured ? firebaseResourceService : mockResourceService;
export const chatService = isFirebaseConfigured ? firebaseChatService : mockChatService;
export const notificationService = isFirebaseConfigured ? firebaseNotificationService : mockNotificationService;

export const currentServiceMode = isFirebaseConfigured ? 'FIREBASE' : 'MOCK';
