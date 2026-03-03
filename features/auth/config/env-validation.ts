export function validateAuthConfig() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missing = requiredEnvVars.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    // Only log error in development or server-side, not in browser
    if (typeof window === 'undefined') {
      console.error('Missing required environment variables:', missing);
    }
    return false;
  }

  return true;
}
