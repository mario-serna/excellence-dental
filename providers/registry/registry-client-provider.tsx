/**
 * Client-side provider registry context.
 * Wraps the component tree to provide access to registered providers.
 */

'use client';

import { PROVIDER_DOMAINS } from '@/providers';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { SupabaseClientAuthProvider } from '../vendors/supabase/auth';
// import { SupabaseClientDashboardProvider } from '../vendors/supabase/dashboard';

// Mock providers
// import { MockClientAuthProvider } from '../vendors/mock/auth';
import { MockClientDashboardProvider } from '../vendors/mock/dashboard';

// Create a separate client registry to avoid type conflicts
const clientProvoders = {
  [PROVIDER_DOMAINS.AUTH]: new SupabaseClientAuthProvider(),
  [PROVIDER_DOMAINS.DASHBOARD]: new MockClientDashboardProvider(),
};

const RegistryContext = createContext(clientProvoders);

interface RegistryClientProviderProps {
  children: ReactNode;
}

export function RegistryClientProvider({
  children,
}: RegistryClientProviderProps) {
  const registryRef = useRef(clientProvoders);

  return (
    <RegistryContext.Provider value={registryRef.current}>
      {children}
    </RegistryContext.Provider>
  );
}

export function useClientRegistry() {
  const registry = useContext(RegistryContext);
  if (!registry) {
    throw new Error(
      'useClientRegistry must be used within a RegistryClientProvider'
    );
  }
  return registry;
}
