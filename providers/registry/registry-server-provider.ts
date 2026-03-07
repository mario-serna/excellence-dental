/**
 * Server-side providers registry.
 * Similar to client-side RegistryProvider but for server contexts.
 * This module should only be imported in server contexts.
 */

import { PROVIDER_DOMAINS } from '@/providers';
import { SupabaseServerAuthProvider } from '../vendors/supabase/auth';

// Export server providers directly - no registry needed
export const serverProviders = {
  [PROVIDER_DOMAINS.AUTH]: new SupabaseServerAuthProvider(),
  // Add future providers here
  // database: new ServerDatabaseProvider(),
  // storage: new ServerStorageProvider(),
};
