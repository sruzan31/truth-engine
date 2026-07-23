'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthUser, fetchCurrentUser, signInWithGoogle, logoutUser, handleGoogleAuthRedirect } from '@/services/auth';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const current = await fetchCurrentUser();
      setUser(current);
      setError(null);
    } catch (err) {
      setUser(null);
      setError('Unable to refresh session.');
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    setLoading(true);
    setError(null);
    try {
      const authenticatedUser = await signInWithGoogle();
      if (authenticatedUser) {
        setUser(authenticatedUser);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      try {
        const redirectUser = await handleGoogleAuthRedirect();
        if (redirectUser) {
          setUser(redirectUser);
          setError(null);
          setLoading(false);
          return;
        }
      } catch (redirectError) {
        console.warn('Redirect authentication result processing failed.', redirectError);
      }

      try {
        const current = await fetchCurrentUser();
        setUser(current);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, login, logout, refreshUser }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
