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
import { InstrumentResponse } from '../types/instruments';
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

// ==========================================
// Instrument Responses Operations (Surveys & Diagnostic)
// ==========================================

export const subscribeToInstrumentResponses = (callback: (responses: InstrumentResponse[]) => void) => {
  try {
    const responsesCol = collection(db, 'instrument_responses');
    const q = query(responsesCol, orderBy('submittedAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const list: InstrumentResponse[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });

        // Also check if there are local offline responses that aren't yet in Firestore
        const localList: InstrumentResponse[] = JSON.parse(
          localStorage.getItem('local_instrument_responses') || '[]'
        );
        const remoteIds = new Set(list.map((r) => r.id));
        const merged = [...list, ...localList.filter((l) => !remoteIds.has(l.id))];

        callback(merged);
      },
      (error) => {
        console.warn('Using local fallback for instrument responses:', error.message);
        const localList: InstrumentResponse[] = JSON.parse(
          localStorage.getItem('local_instrument_responses') || '[]'
        );
        callback(localList);
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to instrument responses:', err);
    const localList: InstrumentResponse[] = JSON.parse(
      localStorage.getItem('local_instrument_responses') || '[]'
    );
    callback(localList);
    return () => {};
  }
};

export const saveInstrumentResponse = async (response: InstrumentResponse): Promise<void> => {
  // Always update localStorage first for instantaneous offline persistence
  try {
    const localList: InstrumentResponse[] = JSON.parse(
      localStorage.getItem('local_instrument_responses') || '[]'
    );
    const existingIndex = localList.findIndex((r) => r.id === response.id);
    if (existingIndex >= 0) {
      localList[existingIndex] = response;
    } else {
      localList.unshift(response);
    }
    localStorage.setItem('local_instrument_responses', JSON.stringify(localList));
  } catch (e) {
    console.warn('Could not save instrument response to localStorage:', e);
  }

  // Push to Firestore
  try {
    const docRef = doc(db, 'instrument_responses', response.id);
    await setDoc(docRef, {
      ...response,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Failed to save instrument response to Firestore (offline fallback maintained):', err);
  }
};

export const removeInstrumentResponse = async (responseId: string): Promise<void> => {
  // Remove from localStorage
  try {
    const localList: InstrumentResponse[] = JSON.parse(
      localStorage.getItem('local_instrument_responses') || '[]'
    );
    const filtered = localList.filter((r) => r.id !== responseId);
    localStorage.setItem('local_instrument_responses', JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to remove response from localStorage:', e);
  }

  // Remove from Firestore
  try {
    const docRef = doc(db, 'instrument_responses', responseId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete instrument response from Firestore:', err);
  }
};

// Draft auto-save helpers for students filling out instruments
export const saveInstrumentDraft = (instrumentId: string, draftData: any): void => {
  try {
    localStorage.setItem(`edupulse_draft_${instrumentId}`, JSON.stringify({
      data: draftData,
      savedAt: new Date().toISOString(),
    }));
  } catch (e) {
    console.warn('Failed to save draft:', e);
  }
};

export const loadInstrumentDraft = (instrumentId: string): { data: any; savedAt: string } | null => {
  try {
    const raw = localStorage.getItem(`edupulse_draft_${instrumentId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to load draft:', e);
    return null;
  }
};

export const clearInstrumentDraft = (instrumentId: string): void => {
  try {
    localStorage.removeItem(`edupulse_draft_${instrumentId}`);
  } catch (e) {
    console.warn('Failed to clear draft:', e);
  }
};
