/**
 * Client-side provider registry context.
 * Wraps the component tree to provide access to registered providers.
 */

'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { SupabaseClientAuthProvider } from '../domain/auth/supabase/client-auth-provider';
import { REGISTRY_KEYS } from './registry-keys';

// Create a separate client registry to avoid type conflicts
const clientProvoders = {
  [REGISTRY_KEYS.AUTH]: new SupabaseClientAuthProvider(),
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
