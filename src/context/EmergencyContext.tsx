import React, { createContext, useContext, useEffect, useState } from 'react';
import { EmergencyRequest, EmergencyNeedCategory, EmergencyStatus, LocationCoordinates, NotificationItem, NGOResource } from '../types';
import { requestService, notificationService, resourceService } from '../services/serviceManager';
import { useAuth } from './AuthContext';

interface EmergencyContextType {
  requests: EmergencyRequest[];
  myRequests: EmergencyRequest[];
  nearbyRequests: EmergencyRequest[];
  activeCount: number;
  createEmergencyRequest: (data: {
    needs: EmergencyNeedCategory[];
    otherNeed?: string;
    description: string;
    location: LocationCoordinates;
    medicalSeverity?: 'low' | 'moderate' | 'serious' | 'critical' | null;
    peopleAffected?: number;
  }) => Promise<EmergencyRequest>;
  acceptRequest: (requestId: string) => Promise<EmergencyRequest>;
  updateStatus: (requestId: string, status: EmergencyStatus) => Promise<EmergencyRequest>;
  resolveRequest: (requestId: string) => Promise<EmergencyRequest>;
  getRequestById: (id: string) => EmergencyRequest | undefined;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  resources: NGOResource[];
  updateResource: (id: string, available: number, allocated: number) => Promise<void>;
  addResource: (type: string, total: number, unit: string) => Promise<void>;
}

import { calculatePriority } from '../services/emergency/priorityEngine';

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, role, isResponder, capabilities } = useAuth();
  const [rawRequests, setRawRequests] = useState<EmergencyRequest[]>(() => requestService.getAllRequests());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => 
    currentUser ? notificationService.getNotifications(currentUser.uid) : []
  );
  const [resources, setResources] = useState<NGOResource[]>(() => 
    resourceService.getResources(currentUser?.uid || 'demo-ngo')
  );
  
  // We need to re-evaluate time-based priorities occasionally.
  const [nowMs, setNowMs] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 60000); // Update priorities every minute
    return () => window.clearInterval(timer);
  }, []);

  // Calculate dynamic priority for all requests
  const requests = rawRequests.map(req => {
    const priorityInfo = calculatePriority(req, resources, nowMs);
    return {
      ...req,
      priorityScore: priorityInfo.score,
      priorityLevel: priorityInfo.level,
      priorityBreakdown: priorityInfo.breakdown
    };
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const unsubRequests = requestService.onRequestsChanged((updated) => {
      setRawRequests(updated);
    });
    return () => {
      if (typeof unsubRequests === 'function') unsubRequests();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const unsubNotifs = notificationService.onNotificationsChanged(currentUser.uid, (items) => {
      setNotifications(items);
    });
    const unsubRes = resourceService.onResourcesChanged(currentUser.uid, (res) => {
      setResources(res);
    });
    return () => {
      if (typeof unsubNotifs === 'function') unsubNotifs();
      if (typeof unsubRes === 'function') unsubRes();
    };
  }, [currentUser]);

  const myRequests = requests.filter(r => 
    currentUser ? (r.requesterId === currentUser.uid || r.acceptedBy === currentUser.uid) : false
  );

  const nearbyRequests = requests.filter(r => {
    if (r.status !== 'active') return false;
    // If responder has capabilities defined, filter relevant, else show all active
    if (isResponder && capabilities.length > 0) {
      return r.needs.some(n => capabilities.includes(n)) || r.needs.includes('Other');
    }
    return true;
  });

  const activeCount = requests.filter(r => r.status === 'active').length;

  const createEmergencyRequest = async (data: {
    needs: EmergencyNeedCategory[];
    otherNeed?: string;
    description: string;
    location: LocationCoordinates;
    medicalSeverity?: 'low' | 'moderate' | 'serious' | 'critical' | null;
    peopleAffected?: number;
  }): Promise<EmergencyRequest> => {
    if (!currentUser) throw new Error('Must be logged in to create an emergency request');

    const created = await requestService.createRequest({
      requesterId: currentUser.uid,
      requesterName: 'name' in currentUser ? currentUser.name : currentUser.orgName,
      requesterPhone: currentUser.phone,
      requesterRole: role === 'ngo' ? 'ngo' : 'user',
      needs: data.needs,
      otherNeed: data.otherNeed,
      description: data.description,
      location: data.location,
      medicalSeverity: data.medicalSeverity,
      peopleAffected: data.peopleAffected
    });

    return created;
  };

  const acceptRequest = async (requestId: string): Promise<EmergencyRequest> => {
    if (!currentUser) throw new Error('Must be logged in to accept request');
    const responderName = 'name' in currentUser ? currentUser.name : currentUser.orgName;
    const responderType = role === 'ngo' ? 'ngo' : 'responder';

    const updated = await requestService.acceptRequest(
      requestId,
      currentUser.uid,
      responderName,
      responderType
    );
    return updated;
  };

  const updateStatus = async (requestId: string, status: EmergencyStatus): Promise<EmergencyRequest> => {
    return await requestService.updateStatus(requestId, status);
  };

  const resolveRequest = async (requestId: string): Promise<EmergencyRequest> => {
    return await requestService.updateStatus(requestId, 'resolved');
  };

  const getRequestById = (id: string): EmergencyRequest | undefined => {
    return requests.find(r => r.id === id);
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
  };

  const markAllNotificationsAsRead = async () => {
    if (currentUser) {
      await notificationService.markAllAsRead(currentUser.uid);
    }
  };

  const updateResource = async (id: string, available: number, allocated: number) => {
    await resourceService.updateResource(id, available, allocated);
  };

  const addResource = async (type: string, total: number, unit: string) => {
    await resourceService.addResource({
      ngoId: currentUser?.uid || 'demo-ngo',
      type,
      total,
      unit
    });
  };

  return (
    <EmergencyContext.Provider
      value={{
        requests,
        myRequests,
        nearbyRequests,
        activeCount,
        createEmergencyRequest,
        acceptRequest,
        updateStatus,
        resolveRequest,
        getRequestById,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resources,
        updateResource,
        addResource
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = (): EmergencyContextType => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
