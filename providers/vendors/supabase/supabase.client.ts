/**
 * Client-side Supabase client factory.
 * Creates and exports a single Supabase client for browser operations.
 * Uses @supabase/ssr package for proper SSR support.
 */

import { clientEnv } from '@/config/env.client.config';
import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for client-side operations.
 * Uses anon key for browser security.
 * Configured for SSR with cookie handling.
 */
export function getSupabaseBrowserClient() {
  return createBrowserClient(
    clientEnv.SUPABASE_URL,
    clientEnv.SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    }
  );
}
