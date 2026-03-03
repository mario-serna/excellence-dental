import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { authConfig } from '../../config/auth-config';

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(
    authConfig.supabase.url,
    authConfig.supabase.anonKey,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
};
