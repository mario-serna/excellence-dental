/**
 * Server-side Supabase client factory.
 * Creates and exports a single Supabase client for server operations.
 * Uses @supabase/ssr package for proper SSR support.
 */

import { serverEnv } from '@/config/env.server.config';
import { createServerClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for server-side operations.
 * Uses service role key for elevated privileges.
 * Note: This should only be used in server components/middleware.
 */
export async function getSupabaseServerClient(request?: Request) {
  if (!request) {
    throw new Error(
      'Request object is required for server-side Supabase client'
    );
  }

  // Create a cookie store that reads from the request headers
  const cookieStore = {
    getAll: () => {
      const cookieHeader = request.headers.get('cookie') || '';
      const cookies = cookieHeader.split(';').map((cookie) => {
        const [name, value] = cookie.trim().split('=');
        return { name, value };
      });
      return cookies;
    },
    setAll: (cookies: any[]) => {
      // No-op for middleware usage - cookies are set by the client
    },
  };

  return createServerClient(
    serverEnv.SUPABASE_URL,
    serverEnv.SUPABASE_ANON_KEY,
    {
      cookies: cookieStore,
    }
  );
}
