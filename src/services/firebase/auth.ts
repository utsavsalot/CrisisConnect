import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

import {
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';

import { auth, db } from './config';

import {
  UserProfile,
  NGOProfile,
  LocationCoordinates
} from '../../types';

export const firebaseAuthService = {

  getCurrentUser(): UserProfile | NGOProfile | null {
    if (!auth || !auth.currentUser) return null;

    // Profile is loaded asynchronously through onAuthStateChanged
    return null;
  },

  async login(
    email: string,
    pass: string
  ): Promise<UserProfile | NGOProfile> {

    if (!auth || !db) {
      throw new Error('Firebase is not configured');
    }

    const cred = await signInWithEmailAndPassword(
      auth,
      email,
      pass
    );

    const uid = cred.user.uid;

    // Check users collection
    const userDoc = await getDoc(
      doc(db, 'users', uid)
    );

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }

    // Check ngos collection
    const ngoDoc = await getDoc(
      doc(db, 'ngos', uid)
    );

    if (ngoDoc.exists()) {
      return ngoDoc.data() as NGOProfile;
    }

    throw new Error('Profile not found in Firestore');
  },

  async signup(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'user' | 'ngo';
    orgType?: string;
    location?: LocationCoordinates;
  }): Promise<UserProfile | NGOProfile> {

    if (!auth || !db) {
      throw new Error('Firebase is not configured');
    }

    const cred = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const uid = cred.user.uid;

    const loc = data.location || {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Mumbai, Maharashtra'
    };

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

      await setDoc(
        doc(db, 'ngos', uid),
        newNgo
      );

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

      await setDoc(
        doc(db, 'users', uid),
        newUser
      );

      return newUser;
    }
  },

  async logout(): Promise<void> {

    if (!auth) return;

    await fbSignOut(auth);
  },

  switchDemoAccount(_key: string) {

    // Firebase mode does not use demo accounts
    return null;
  },

  onAuthStateChanged(
    callback: (
      user: UserProfile | NGOProfile | null
    ) => void
  ) {

    if (!auth || !db) {
      callback(null);
      return () => {};
    }

    return fbOnAuthStateChanged(
      auth,
      async (fbUser: FirebaseUser | null) => {

        if (!fbUser || !db) {
          callback(null);
          return;
        }

        try {

          // Look for normal user
          const uDoc = await getDoc(
            doc(db, 'users', fbUser.uid)
          );

          if (uDoc.exists()) {
            callback(
              uDoc.data() as UserProfile
            );
            return;
          }

          // Look for NGO
          const nDoc = await getDoc(
            doc(db, 'ngos', fbUser.uid)
          );

          if (nDoc.exists()) {
            callback(
              nDoc.data() as NGOProfile
            );
            return;
          }

          callback(null);

        } catch (err) {

          console.error(
            'Firebase profile fetch error:',
            err
          );

          callback(null);
        }
      }
    );
  }
};