import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { usePatientStore } from './patientStore';

// Demo credentials fallback (works without real Firebase)
const DEMO_EMAIL = 'demo@healthos.com';
const DEMO_PASSWORD = 'password123';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  watchAuth: () => () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      // Try Firebase first; fall back to demo credentials
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        // Create a mock user object for demo mode
        const mockUser = {
          uid: 'demo-user-001',
          email: DEMO_EMAIL,
          displayName: 'Dr. Alex Morgan',
          photoURL: null,
        } as unknown as User;
        set({ user: mockUser, loading: false });
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      set({ loading: false });
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      // If Firebase isn't configured, accept demo credentials
      if (
        firebaseErr?.code === 'auth/invalid-api-key' ||
        firebaseErr?.code === 'auth/network-request-failed' ||
        firebaseErr?.code === 'auth/project-not-found'
      ) {
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          const mockUser = {
            uid: 'demo-user-001',
            email: DEMO_EMAIL,
            displayName: 'Dr. Alex Morgan',
            photoURL: null,
          } as unknown as User;
          usePatientStore.getState().initializeForUser(DEMO_EMAIL);
          set({ user: mockUser, loading: false });
          return;
        }
      }
      let message = 'Login failed. Please try again.';
      if (firebaseErr?.code === 'auth/user-not-found' || firebaseErr?.code === 'auth/wrong-password' || firebaseErr?.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      } else if (firebaseErr?.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please wait before trying again.';
      }
      set({ error: message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
    } catch {
      // Handle demo mode logout
    }
    set({ user: null, loading: false });
  },

  signup: async (email: string, password: string, displayName: string) => {
    set({ loading: true, error: null });
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name on the new user profile
      await updateProfile(credential.user, { displayName });
      usePatientStore.getState().initializeForUser(email);
      set({ user: credential.user, loading: false });
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      let message = 'Signup failed. Please try again.';
      if (firebaseErr?.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists.';
      } else if (firebaseErr?.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (firebaseErr?.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else {
        console.error('Firebase signup error:', err);
      }
      set({ error: message, loading: false });
    }
  },

  clearError: () => set({ error: null }),

  watchAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        usePatientStore.getState().initializeForUser(user.email);
      }
      set({ user, initialized: true });
    });
    // Mark initialized even if Firebase errors (demo mode)
    setTimeout(() => set((s) => ({ initialized: s.initialized || true })), 1500);
    return unsubscribe;
  },
}));
