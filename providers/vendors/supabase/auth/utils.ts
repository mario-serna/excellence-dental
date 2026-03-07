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

// Add future Supabase-specific auth helpers here.
// Examples:
//   export function mapSession(raw: SupabaseSession): Session { ... }
//   export function isExpired(raw: SupabaseSession): boolean { ... }
