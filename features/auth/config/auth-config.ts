export const AUTH_PROVIDERS = {
  SUPABASE: 'supabase',
} as const;

export type AuthProviderType =
  (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];

export const authConfig = {
  provider: process.env.NEXT_PUBLIC_AUTH_PROVIDER || AUTH_PROVIDERS.SUPABASE,
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
} as const;

export type AuthConfig = typeof authConfig;
