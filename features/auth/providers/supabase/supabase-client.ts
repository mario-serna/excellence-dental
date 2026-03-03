import { createBrowserClient } from '@supabase/ssr';
import { authConfig } from '../../config/auth-config';

export const createSupabaseClient = () => {
  return createBrowserClient(
    authConfig.supabase.url,
    authConfig.supabase.anonKey
  );
};
