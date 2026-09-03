import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { UserProfile, NGOProfile, LocationCoordinates } from '../../types';

export const firebaseAuthService = {
  getCurrentUser(): UserProfile | NGOProfile | null {
    if (!auth || !auth.currentUser) return null;
    return null; // Will populate via onAuthStateChanged
  },

  async login(email: string, pass: string): Promise<UserProfile | NGOProfile> {
    if (!auth || !db) throw new Error('Firebase is not configured');
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const uid = cred.user.uid;

    // Check user profile
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }

    // Check NGO profile
    const ngoDoc = await getDoc(doc(db, 'ngos', uid));
    if (ngoDoc.exists()) {
      return ngoDoc.data() as NGOProfile;
    }

    throw new Error('Profile not found in Firestore');
  },

  async signup(data: {
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'ngo';
    orgType?: string;
    location?: LocationCoordinates;
  }): Promise<UserProfile | NGOProfile> {
    if (!auth || !db) throw new Error('Firebase is not configured');
    const cred = await createUserWithEmailAndPassword(auth, data.email, 'TempPass123!');
    const uid = cred.user.uid;
    const loc = data.location || { latitude: 40.7128, longitude: -74.0060, address: 'New York, NY' };

    if (data.role === 'ngo') {
      const newNgo: NGOProfile = {
        uid,
        orgName: data.name,
        email: data.email,
        phone: data.phone,
        role: 'ngo',
        orgType: data.orgType || 'Humanitarian Relief',
        location: loc,
        verified: true,
        activeMissions: 0,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'ngos', uid), newNgo);
      return newNgo;
    } else {
      const newUser: UserProfile = {
        uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'user',
        responderMode: false,
        isAvailable: false,
        capabilities: [],
        location: loc,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', uid), newUser);
      return newUser;
    }
  },

  async logout(): Promise<void> {
    if (!auth) return;
    await fbSignOut(auth);
  },

  switchDemoAccount(_key: string) {
    // In Firebase mode, account switching is performed via login/signup
    return null;
  },

  onAuthStateChanged(callback: (user: UserProfile | NGOProfile | null) => void) {
    if (!auth || !db) {
      callback(null);
      return () => {};
    }
    return fbOnAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser || !db) {
        callback(null);
        return;
      }
      try {
        const uDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (uDoc.exists()) {
          callback(uDoc.data() as UserProfile);
          return;
        }
        const nDoc = await getDoc(doc(db, 'ngos', fbUser.uid));
        if (nDoc.exists()) {
          callback(nDoc.data() as NGOProfile);
          return;
        }
        callback(null);
      } catch (err) {
        console.error('Firebase profile fetch error:', err);
        callback(null);
      }
    });
  }
};
