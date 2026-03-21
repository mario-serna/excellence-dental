import { User, USER_ROLES } from '@/providers';
import { User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Maps a raw Supabase user object to the application's User type.
 * This is the only place in the codebase that knows the Supabase user shape.
 * If Supabase changes their API, fix it here — nowhere else.
 */
export function mapUser(raw: SupabaseUser): User {
  return {
    id: raw.id,
    email: raw.email!,
    role: (raw.app_metadata?.role as User['role']) ?? USER_ROLES.assistant,
    metadata: {
      full_name: raw.user_metadata?.full_name as string,
      ...raw.user_metadata,
    },
  };
}

/**
 * Maps Supabase error messages to locale keys for internationalization
 */
export function mapErrorToLocaleKey(errorMessage: string): string {
  // Common Supabase auth error mappings
  const errorMappings: Record<string, string> = {
    'Invalid login credentials': 'auth.invalidCredentials',
    'Email not confirmed': 'auth.emailNotConfirmed',
    'Invalid email': 'forms.invalidEmail',
    'Password should be at least 6 characters': 'auth.passwordTooShort',
    'Too many requests': 'auth.tooManyRequests',
    'User already registered': 'auth.userAlreadyExists',
    'Signup requires a valid password': 'auth.invalidPassword',
    'Unable to validate email address: invalid format': 'forms.invalidEmail',
    'Invalid password': 'auth.invalidPassword',
  };

  // Check for exact matches first
  if (errorMappings[errorMessage]) {
    return errorMappings[errorMessage];
  }

  // Check for partial matches
  if (errorMessage.includes('Invalid login credentials')) {
    return 'auth.invalidCredentials';
  }
  if (errorMessage.includes('Email not confirmed')) {
    return 'auth.emailNotConfirmed';
  }
  if (
    errorMessage.includes('Invalid email') ||
    errorMessage.includes('invalid format')
  ) {
    return 'forms.invalidEmail';
  }
  if (
    errorMessage.includes('Password') &&
    (errorMessage.includes('short') || errorMessage.includes('at least'))
  ) {
    return 'auth.passwordTooShort';
  }
  if (
    errorMessage.includes('Too many requests') ||
    errorMessage.includes('rate limit')
  ) {
    return 'auth.tooManyRequests';
  }
  if (
    errorMessage.includes('already registered') ||
    errorMessage.includes('already exists')
  ) {
    return 'auth.userAlreadyExists';
  }
  if (errorMessage.includes('network') || errorMessage.includes('connection')) {
    return 'messages.networkError';
  }
  if (errorMessage.includes('server') || errorMessage.includes('internal')) {
    return 'messages.serverError';
  }

  // Default fallback
  return 'messages.error';
}

// Add future Supabase-specific auth helpers here.
// Examples:
//   export function mapSession(raw: SupabaseSession): Session { ... }
//   export function isExpired(raw: SupabaseSession): boolean { ... }
