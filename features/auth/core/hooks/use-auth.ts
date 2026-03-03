'use client';
import { useNavigation } from '@/lib/hooks/use-navigation';
import { useEffect, useState } from 'react';
import { User } from '../interfaces/auth-provider.interface';
import { authService } from '../services/auth.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { navigateToDashboard, navigateToLogin } = useNavigation();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Get initial user
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const result = await authService.signIn(email, password);

    if (result.success) {
      setUser(result.user!);
      navigateToDashboard();
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    navigateToLogin();
  };

  return { user, loading, error, signIn, signOut };
}
