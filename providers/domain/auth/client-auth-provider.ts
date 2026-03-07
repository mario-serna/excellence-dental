import {
  Provider,
  PROVIDER_CONTEXTS,
  PROVIDER_DOMAINS,
  ProviderVendor,
} from '@/providers/provider';
import { AuthError } from './auth-error';
import type { AuthResult, User } from './interfaces/auth-provider.interface';
import type { UserRole } from './types/role.types';
import { USER_ROLES } from './types/role.types';

/**
 * Client-side base class for authentication providers.
 * Handles session management and client-side authentication logic.
 */
export abstract class ClientAuthProvider extends Provider {
  abstract signIn(email: string, password: string): Promise<AuthResult>;
  abstract signOut(): Promise<void>;
  abstract getCurrentUser(): Promise<User | null>;
  abstract onAuthStateChange(callback: (user: User | null) => void): () => void;
  abstract updateUserRole(userId: string, role: UserRole): Promise<void>;

  /**
   * Helper method for auth providers to generate names.
   * Usage: return ClientAuthProvider.createName('SUPABASE')
   */
  protected static createName(vendor: ProviderVendor): string {
    return Provider.createName(
      vendor,
      PROVIDER_CONTEXTS.CLIENT,
      PROVIDER_DOMAINS.AUTH
    );
  }

  // ── Concrete shared logic ─────────────────────────────────────────
  // Client-side convenience methods that use getCurrentUser()

  async isAuthenticated(): Promise<boolean> {
    return (await this.getCurrentUser()) !== null;
  }

  async requireAuth(): Promise<User> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new AuthError('auth.errors.notAuthenticated', 401);
    }
    return user;
  }

  async requireRole(...roles: User['role'][]): Promise<User> {
    const user = await this.requireAuth();
    if (!roles.includes(user.role)) {
      throw new AuthError('auth.errors.insufficientRole', 403);
    }
    return user;
  }

  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === USER_ROLES.admin;
  }

  // For server interface compatibility (used by registry)
  async getUser(request: Request): Promise<User | null> {
    return this.getCurrentUser();
  }
}
