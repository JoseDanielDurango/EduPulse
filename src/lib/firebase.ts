import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  signInAnonymously,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { InterviewGuide, InterviewSession } from '../types';
import { DEFAULT_GUIDES } from './defaultGuides';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Database configuration as provisioned
let dbInstance: Firestore;
try {
  // Use user's dedicated firestore database ID
  dbInstance = getFirestore(app, 'ai-studio-69bb353c-ae84-4e1e-95a9-e601ea2eeee5');
} catch (e) {
  console.warn('Fallback to default firestore db:', e);
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');

// Auth actions
export const syncUserProfile = async (user: User) => {
  if (!user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || 'Investigador/a',
      email: user.email || '',
      photoURL: user.photoURL || '',
      lastLoginAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Failed to sync user profile to firestore:', err);
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
    if (accessToken) {
      localStorage.setItem('google_oauth_token', accessToken);
    }
    await syncUserProfile(result.user);
    return { user: result.user, accessToken };
  } catch (err: any) {
    console.error('Google Sign In failed:', err);
    throw err;
  }
};

export const loginAnonymously = async () => {
  return await signInAnonymously(auth);
};

export const logout = async () => {
  localStorage.removeItem('google_oauth_token');
  return await signOut(auth);
};

export const observeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      syncUserProfile(user);
    }
    callback(user);
  });
};

// Firestore Sessions Operations
export const subscribeToSessions = (callback: (sessions: InterviewSession[]) => void) => {
  try {
    const sessionsCol = collection(db, 'sessions');
    const q = query(sessionsCol, orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: InterviewSession[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        callback(list);
      },
      (error) => {
        console.error('Error in subscribeToSessions:', error);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to sessions:', err);
    return () => {};
  }
};

export const subscribeToSession = (sessionId: string, callback: (session: InterviewSession | null) => void) => {
  if (!sessionId) return () => {};
  try {
    const docRef = doc(db, 'sessions', sessionId);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...(docSnap.data() as any) });
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error(`Error in subscribeToSession (${sessionId}):`, error);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to session:', err);
    return () => {};
  }
};

export const saveSession = async (session: InterviewSession) => {
  try {
    const docRef = doc(db, 'sessions', session.id);
    await setDoc(docRef, {
      ...session,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.error('Failed to save session to Firestore:', err);
    // Local fallback in case of network or permissions
    const stored = JSON.parse(localStorage.getItem('local_sessions') || '{}');
    stored[session.id] = session;
    localStorage.setItem('local_sessions', JSON.stringify(stored));
  }
};

export const removeSession = async (sessionId: string) => {
  try {
    const docRef = doc(db, 'sessions', sessionId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete session:', err);
  }
};

// Firestore Guides Operations
export const subscribeToGuides = (callback: (guides: InterviewGuide[]) => void) => {
  try {
    const guidesCol = collection(db, 'guides');
    const q = query(guidesCol, orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: InterviewGuide[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        if (list.length === 0) {
          // If no custom guides exist yet, provide default pre-built templates
          callback(DEFAULT_GUIDES);
        } else {
          // Combine defaults and custom guides
          const existingIds = new Set(list.map((g) => g.id));
          const merged = [...list, ...DEFAULT_GUIDES.filter((d) => !existingIds.has(d.id))];
          callback(merged);
        }
      },
      (error) => {
        console.warn('Using local default guides due to:', error.message);
        callback(DEFAULT_GUIDES);
      }
    );
  } catch {
    callback(DEFAULT_GUIDES);
    return () => {};
  }
};

export const saveGuide = async (guide: InterviewGuide) => {
  try {
    const docRef = doc(db, 'guides', guide.id);
    await setDoc(docRef, {
      ...guide,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to save guide to Firestore:', err);
  }
};
