/**
 * Server-side providers registry.
 * Similar to client-side RegistryProvider but for server contexts.
 * This module should only be imported in server contexts.
 */

import { PROVIDER_DOMAINS } from '@/providers';
import { SupabaseServerAuthProvider } from '../vendors/supabase/auth';
// import { SupabaseServerDashboardProvider } from '../vendors/supabase/dashboard';

// Mock
import { MockServerDashboardProvider } from '../vendors/mock/dashboard';

// Export server providers directly - no registry needed
export const serverProviders = {
  [PROVIDER_DOMAINS.AUTH]: new SupabaseServerAuthProvider(),
  [PROVIDER_DOMAINS.DASHBOARD]: new MockServerDashboardProvider(),
  // Add future providers here
  // database: new ServerDatabaseProvider(),
  // storage: new ServerStorageProvider(),
};
