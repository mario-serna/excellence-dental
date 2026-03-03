import {
  AuthResult,
  IAuthProvider,
  User,
} from '../../core/interfaces/auth-provider.interface';
import { type UserRole } from '../../core/types/role.types';
import { createSupabaseClient } from './supabase-client';

export class SupabaseAuthProvider implements IAuthProvider {
  private client = createSupabaseClient();

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email!,
          role: data.user.user_metadata?.role as UserRole,
        },
      };
    } catch (err) {
      return { success: false, error: 'Authentication failed' };
    }
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.client.auth.getUser();
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role as UserRole,
    };
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const {
      data: { subscription },
    } = this.client.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        callback(null);
        return;
      }

      callback({
        id: session.user.id,
        email: session.user.email!,
        role: session.user.user_metadata?.role as UserRole,
      });
    });

    return () => subscription.unsubscribe();
  }

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    await this.client.auth.admin.updateUserById(userId, {
      user_metadata: { role },
      app_metadata: { role },
    });
  }
}
