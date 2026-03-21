'use client';

import { PROVIDER_DOMAINS, useClientRegistry, User } from '@/providers';
import { useEffect, useState } from 'react';

export function useAuth() {
  const registry = useClientRegistry();
  const authProvider = registry[PROVIDER_DOMAINS.AUTH];

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize user state on mount with retry mechanism
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    const initializeUser = async () => {
      try {
        const currentUser = await authProvider.getCurrentUser();
        setUser(currentUser);
        setError(null);
      } catch (error) {
        console.error('Error initializing user:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initializeUser, 1000 * retryCount); // Exponential backoff
        } else {
          setError('Failed to initialize authentication');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [authProvider]);

  // Set up auth state change listener
  useEffect(() => {
    const unsubscribe = authProvider.onAuthStateChange((newUser) => {
      setUser(newUser);
    });

    return unsubscribe;
  }, [authProvider]);

  // Wrap signIn with loading state
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authProvider.signIn(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Wrap signOut with state management
  const signOut = async () => {
    setLoading(true);
    try {
      await authProvider.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };
}
