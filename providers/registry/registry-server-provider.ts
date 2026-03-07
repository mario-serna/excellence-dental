/**
 * Server-side providers registry.
 * Similar to client-side RegistryProvider but for server contexts.
 * This module should only be imported in server contexts.
 */

import { SupabaseServerAuthProvider } from '../domain/auth/supabase/server-auth-provider';

// Export server providers directly - no registry needed
export const serverProviders = {
  auth: new SupabaseServerAuthProvider(),
  // Add future providers here
  // database: new ServerDatabaseProvider(),
  // storage: new ServerStorageProvider(),
};
