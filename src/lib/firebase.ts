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

// Use the default Firestore database instance
export const db = getFirestore(app);
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

// Firestore Sessions Operations (With automatic localStorage local-first sync)
const getLocalSessions = (): InterviewSession[] => {
  try {
    const stored = JSON.parse(localStorage.getItem('local_sessions') || '{}');
    return Object.values(stored).sort((a: any, b: any) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    ) as InterviewSession[];
  } catch {
    return [];
  }
};

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

        // Merge local sessions that might not yet be in remote
        const localList = getLocalSessions();
        const remoteIds = new Set(list.map((s) => s.id));
        const merged = [...list, ...localList.filter((s) => !remoteIds.has(s.id))];

        callback(merged);
      },
      (error) => {
        console.warn('Using local fallback for sessions:', error.message);
        callback(getLocalSessions());
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to sessions, using local fallback:', err);
    callback(getLocalSessions());
    return () => {};
  }
};

export const subscribeToSession = (sessionId: string, callback: (session: InterviewSession | null) => void) => {
  if (!sessionId) return () => {};

  const getLocalSession = (): InterviewSession | null => {
    try {
      const stored = JSON.parse(localStorage.getItem('local_sessions') || '{}');
      return stored[sessionId] || null;
    } catch {
      return null;
    }
  };

  try {
    const docRef = doc(db, 'sessions', sessionId);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...(docSnap.data() as any) });
        } else {
          callback(getLocalSession());
        }
      },
      (error) => {
        console.warn(`Error in subscribeToSession (${sessionId}), using local:`, error.message);
        callback(getLocalSession());
      }
    );
  } catch (err) {
    console.error('Failed to subscribe to session:', err);
    callback(getLocalSession());
    return () => {};
  }
};

export const saveSession = async (session: InterviewSession) => {
  // Always update localStorage first for instantaneous offline persistence
  try {
    const stored = JSON.parse(localStorage.getItem('local_sessions') || '{}');
    stored[session.id] = {
      ...session,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('local_sessions', JSON.stringify(stored));
  } catch (e) {
    console.warn('Could not save session to localStorage:', e);
  }

  // Push to Firestore
  try {
    const docRef = doc(db, 'sessions', session.id);
    await setDoc(docRef, {
      ...session,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Failed to save session to Firestore (offline fallback maintained):', err);
  }
};

export const removeSession = async (sessionId: string) => {
  try {
    const stored = JSON.parse(localStorage.getItem('local_sessions') || '{}');
    delete stored[sessionId];
    localStorage.setItem('local_sessions', JSON.stringify(stored));
  } catch (e) {
    console.warn('Failed to delete session from localStorage:', e);
  }

  try {
    const docRef = doc(db, 'sessions', sessionId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Failed to delete session from Firestore:', err);
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
