import { auth, googleProvider } from '@/lib/firebase';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: string;
  lastLogin: string;
  analysisCount: number;
}

export async function handleGoogleAuthRedirect(): Promise<AuthUser | null> {
  if (!auth) {
    return null;
  }

  try {
    const result = await getRedirectResult(auth);
    if (!result?.user) {
      return null;
    }
    return await sendUserToBackend(result.user.uid, result.user.displayName ?? '', result.user.email ?? '', result.user.photoURL ?? '', await result.user.getIdToken());
  } catch (error) {
    console.error('Redirect sign in failed', error);
    return null;
  }
}

async function sendUserToBackend(
  uid: string,
  name: string,
  email: string,
  photoURL: string,
  idToken: string
): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uid, name, email, photoURL, idToken }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.detail || 'Failed to authenticate with Truth Engine.');
  }

  const data = await response.json();
  return data.user as AuthUser;
}

export async function signInWithGoogle(): Promise<AuthUser | null> {
  if (!auth || !googleProvider) {
    throw new Error('Firebase auth is unavailable because Firebase is not configured correctly or this code is running outside the browser.');
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();
    return await sendUserToBackend(user.uid, user.displayName ?? '', user.email ?? '', user.photoURL ?? '', token);
  } catch (error: any) {
    if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }

    throw new Error(error?.message || 'Google authentication failed.');
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    if (auth) {
      await signOut(auth).catch(() => null);
    }
  }
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data as AuthUser;
}
