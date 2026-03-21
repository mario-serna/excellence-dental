/**
 * Client-side environment configuration.
 * Only variables safe for browser exposure are included here.
 * This file can be imported in client components.
 */

/**
 * Client-side configuration object.
 * Contains only environment variables safe for browser exposure.
 */
export const clientEnv = {
  // Client-side Supabase configuration (safe for browser)
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',

  // Add future client-side environment variables here
  // NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  // NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
} as const;
