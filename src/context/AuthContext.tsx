import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, NGOProfile, UserRole, EmergencyNeedCategory, LocationCoordinates, FamilyMemberContact } from '../types';
import { authService, responderService } from '../services/serviceManager';

interface AuthContextType {
  currentUser: UserProfile | NGOProfile | null;
  role: UserRole;
  isResponder: boolean;
  isAvailable: boolean;
  capabilities: EmergencyNeedCategory[];
  login: (email: string, pass: string) => Promise<void>;
  signup: (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'ngo';
  orgType?: string;
  location?: LocationCoordinates;
  address?: string;
  gender?: string;
  age?: string | number;
  bloodGroup?: string;
  medicalHistory?: string[];
  emergencyContacts?: FamilyMemberContact[];
  registrationId?: string;
  operatingArea?: string;
  emergencyServices?: EmergencyNeedCategory[];
}) => Promise<void>;
  logout: () => Promise<void>;
  toggleResponderMode: (enabled: boolean) => Promise<void>;
  setAvailability: (available: boolean) => Promise<void>;
  updateCapabilities: (caps: EmergencyNeedCategory[]) => Promise<void>;
  switchDemoAccount: (key: 'demo-user' | 'demo-responder' | 'demo-ngo' | 'demo-admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | NGOProfile | null>(() => {
    return authService.getCurrentUser();
  });

  useEffect(() => {
    const unsub = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const role: UserRole = currentUser?.role || 'user';
  
  const isResponder: boolean = 
    currentUser?.role === 'user' && Boolean((currentUser as UserProfile).responderMode);

  const isAvailable: boolean = 
    currentUser?.role === 'user' && Boolean((currentUser as UserProfile).isAvailable);

  const capabilities: EmergencyNeedCategory[] = 
    currentUser?.role === 'user' ? (currentUser as UserProfile).capabilities || [] : [];

  const login = async (email: string, pass: string) => {
    const user = await authService.login(email, pass);
    setCurrentUser(user);
  };

  const signup = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'ngo';
  orgType?: string;
  location?: LocationCoordinates;
  address?: string;
  gender?: string;
  age?: string | number;
  bloodGroup?: string;
  medicalHistory?: string[];
  emergencyContacts?: FamilyMemberContact[];
  registrationId?: string;
  operatingArea?: string;
  emergencyServices?: EmergencyNeedCategory[];
}) => {
    const user = await authService.signup(data);
    setCurrentUser(user);
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(authService.getCurrentUser());
  };

  const toggleResponderMode = async (enabled: boolean) => {
    if (!currentUser || currentUser.role !== 'user') return;
    const updated = await responderService.toggleResponderMode(currentUser.uid, enabled);
    setCurrentUser(updated);
  };

  const setAvailability = async (available: boolean) => {
    if (!currentUser || currentUser.role !== 'user') return;
    const updated = await responderService.setAvailability(currentUser.uid, available);
    setCurrentUser(updated);
  };

  const updateCapabilities = async (caps: EmergencyNeedCategory[]) => {
    if (!currentUser || currentUser.role !== 'user') return;
    const updated = await responderService.updateCapabilities(currentUser.uid, caps);
    setCurrentUser(updated);
  };

  const switchDemoAccount = (key: 'demo-user' | 'demo-responder' | 'demo-ngo' | 'demo-admin') => {
    const switched = authService.switchDemoAccount(key);
    setCurrentUser(switched);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isResponder,
        isAvailable,
        capabilities,
        login,
        signup,
        logout,
        toggleResponderMode,
        setAvailability,
        updateCapabilities,
        switchDemoAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
