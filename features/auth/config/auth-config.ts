import { validateAuthConfig } from './env-validation';

export const AUTH_PROVIDERS = {
  SUPABASE: 'supabase',
} as const;

export type AuthProviderType =
  (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];

// Only validate environment variables on server side
if (typeof window === 'undefined' && !validateAuthConfig()) {
  console.warn(
    'Auth configuration validation failed - some features may not work'
  );
}

export const authConfig = {
  provider: process.env.NEXT_PUBLIC_AUTH_PROVIDER || AUTH_PROVIDERS.SUPABASE,
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
} as const;

export type AuthConfig = typeof authConfig;
