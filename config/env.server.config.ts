/**
 * Server-side environment configuration.
 * Contains sensitive variables that should only be used on the server.
 * This file should NOT be imported in client components.
 */

/**
 * Server-side configuration object.
 * Contains sensitive variables and elevated privilege keys.
 * SECURITY: This should only be used in server contexts.
 */
export const serverEnv = {
  // Server-side Supabase configuration
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // Add future server-side environment variables here
  // DATABASE_URL: process.env.DATABASE_URL,
  // STORAGE_BUCKET: process.env.STORAGE_BUCKET,
  // STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
} as const;
