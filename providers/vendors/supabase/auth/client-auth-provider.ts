/**
 * Supabase client-side authentication provider.
 * Handles browser-side authentication with session management.
 */

'use client';

import {
  AuthResult,
  ClientAuthProvider,
  PROVIDER_VENDORS,
  User,
  UserRole,
} from '@/providers';
import { getSupabaseBrowserClient } from '../supabase.client';
import { mapErrorToLocaleKey, mapUser } from './utils';

export class SupabaseClientAuthProvider extends ClientAuthProvider {
  readonly name = ClientAuthProvider.createName(PROVIDER_VENDORS.SUPABASE);
  private authStateCallbacks: ((user: User | null) => void)[] = [];
  private readonly supabase = getSupabaseBrowserClient();

  constructor() {
    super();
    // Bind all methods to preserve 'this' context when methods are destructured
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.onAuthStateChange = this.onAuthStateChange.bind(this);
    this.updateUserRole = this.updateUserRole.bind(this);
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const localeKey = mapErrorToLocaleKey(error.message);
      return { success: false, error: localeKey };
    }

    return { success: true, user: mapUser(data.user) };
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser();
    if (error || !data.user) return null;
    return mapUser(data.user);
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authStateCallbacks.push(callback);

    const {
      data: { subscription },
    } = this.supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ? mapUser(session.user) : null;
      callback(user);
    });

    return () => subscription.unsubscribe();
  }

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    const { error } = await this.supabase.auth.admin.updateUserById(userId, {
      app_metadata: {
        role: role,
      },
    });

    if (error) throw error;
  }
}
