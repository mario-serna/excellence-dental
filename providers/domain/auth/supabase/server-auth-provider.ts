/**
 * Supabase server-side authentication provider.
 * Handles server-side authentication with elevated privileges.
 */

import { PROVIDER_VENDORS } from '@/providers';
import { getSupabaseServerClient } from '@/providers/vendors/supabase/supabase.server';
import { ServerAuthProvider } from '../core';
import type { User } from '../core/interfaces/auth-provider.interface';
import { mapUser } from './utils';

export class SupabaseServerAuthProvider extends ServerAuthProvider {
  readonly name = ServerAuthProvider.createName(PROVIDER_VENDORS.SUPABASE);

  async getUser(request: Request): Promise<User | null> {
    const supabase = await getSupabaseServerClient(request);
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return mapUser(data.user);
  }
}
